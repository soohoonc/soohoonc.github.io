use super::process::{ProcessControlBlock, ProcessState, PID};
use std::collections::{VecDeque, HashMap};
use wasm_bindgen::prelude::*;

// Multi-Level Feedback Queue (MLFQ) Scheduler
// Based on Chapter 8 of "Operating Systems: Three Easy Pieces"

#[derive(Debug, Clone, Copy)]
pub enum SchedulingPolicy {
    RoundRobin,
    ShortestJobFirst,
    FirstComeFirstServe,
    MLFQ,
}

#[derive(Debug, Clone)]
pub struct QueueLevel {
    pub processes: VecDeque<PID>,
    pub time_slice: u32,
    pub priority: u8,
}

impl QueueLevel {
    pub fn new(priority: u8, time_slice: u32) -> Self {
        Self {
            processes: VecDeque::new(),
            time_slice,
            priority,
        }
    }

    pub fn enqueue(&mut self, pid: PID) {
        if !self.processes.contains(&pid) {
            self.processes.push_back(pid);
        }
    }

    pub fn dequeue(&mut self) -> Option<PID> {
        self.processes.pop_front()
    }

    pub fn is_empty(&self) -> bool {
        self.processes.is_empty()
    }

    pub fn contains(&self, pid: PID) -> bool {
        self.processes.contains(&pid)
    }

    pub fn remove(&mut self, pid: PID) {
        self.processes.retain(|&p| p != pid);
    }
}

#[derive(Debug)]
pub struct ProcessStats {
    pub total_runtime: u64,
    pub time_in_current_slice: u32,
    pub queue_level: u8,
    pub last_scheduled: u64,
    pub io_wait_time: u64,
    pub context_switches: u32,
}

impl ProcessStats {
    pub fn new() -> Self {
        Self {
            total_runtime: 0,
            time_in_current_slice: 0,
            queue_level: 0, // Start at highest priority
            last_scheduled: 0,
            io_wait_time: 0,
            context_switches: 0,
        }
    }
}

pub struct Scheduler {
    policy: SchedulingPolicy,
    current_process: Option<PID>,
    
    // MLFQ specific
    queues: Vec<QueueLevel>,
    process_stats: HashMap<PID, ProcessStats>,
    
    // Timing
    current_time: u64,
    boost_period: u64,     // Time after which all processes get boosted to top queue
    last_boost: u64,
    
    // Lottery scheduling
    total_tickets: u32,
    process_tickets: HashMap<PID, u32>,
}

impl Scheduler {
    pub fn new() -> Self {
        let mut scheduler = Self {
            policy: SchedulingPolicy::MLFQ,
            current_process: None,
            queues: Vec::new(),
            process_stats: HashMap::new(),
            current_time: 0,
            boost_period: 100, // Boost every 100 time units
            last_boost: 0,
            total_tickets: 0,
            process_tickets: HashMap::new(),
        };
        
        // Initialize MLFQ with 3 queues
        // Queue 0: High priority, short time slice (round robin)
        // Queue 1: Medium priority, medium time slice
        // Queue 2: Low priority, long time slice (FCFS-like)
        scheduler.queues.push(QueueLevel::new(0, 4));   // 4 time units
        scheduler.queues.push(QueueLevel::new(1, 8));   // 8 time units  
        scheduler.queues.push(QueueLevel::new(2, 16));  // 16 time units
        
        scheduler
    }

    pub fn set_policy(&mut self, policy: SchedulingPolicy) {
        self.policy = policy;
    }

    pub fn add_process(&mut self, pid: PID) {
        // Add to highest priority queue (queue 0)
        self.queues[0].enqueue(pid);
        self.process_stats.insert(pid, ProcessStats::new());
        
        // Give default tickets for lottery scheduling
        self.process_tickets.insert(pid, 10);
        self.total_tickets += 10;
    }

    pub fn remove_process(&mut self, pid: PID) {
        // Remove from all queues
        for queue in &mut self.queues {
            queue.remove(pid);
        }
        self.process_stats.remove(&pid);
        
        // Remove tickets
        if let Some(tickets) = self.process_tickets.remove(&pid) {
            self.total_tickets -= tickets;
        }
        
        if self.current_process == Some(pid) {
            self.current_process = None;
        }
    }

    pub fn schedule(&mut self, process_manager: &mut ProcessControlBlock) {
        self.current_time += 1;
        
        // Check if we need to boost all processes
        if self.current_time - self.last_boost >= self.boost_period {
            self.boost_all_processes();
            self.last_boost = self.current_time;
        }
        
        match self.policy {
            SchedulingPolicy::MLFQ => self.schedule_mlfq(process_manager),
            SchedulingPolicy::RoundRobin => self.schedule_round_robin(process_manager),
            SchedulingPolicy::ShortestJobFirst => self.schedule_sjf(process_manager),
            SchedulingPolicy::FirstComeFirstServe => self.schedule_fcfs(process_manager),
        }
    }

    fn schedule_mlfq(&mut self, process_manager: &mut ProcessControlBlock) {
        // If current process is running, check if it should be preempted
        if let Some(current_pid) = self.current_process {
            if let Some(stats) = self.process_stats.get_mut(&current_pid) {
                stats.time_in_current_slice += 1;
                stats.total_runtime += 1;
                
                let current_queue_level = stats.queue_level as usize;
                let time_slice = self.queues[current_queue_level].time_slice;
                
                // Check if time slice is exceeded
                if stats.time_in_current_slice >= time_slice {
                    // Demote process if not already at lowest queue
                    if current_queue_level < self.queues.len() - 1 {
                        stats.queue_level += 1;
                    }
                    
                    // Reset time slice
                    stats.time_in_current_slice = 0;
                    
                    // Move back to appropriate queue
                    let new_queue_level = stats.queue_level as usize;
                    self.queues[new_queue_level].enqueue(current_pid);
                    
                    // Set process to ready and find new process
                    if let Some(process) = process_manager.processes.get_mut(&current_pid) {
                        process.state = ProcessState::Ready;
                    }
                    
                    self.current_process = None;
                    stats.context_switches += 1;
                }
            }
        }
        
        // If no current process, find next one from highest priority queue
        if self.current_process.is_none() {
            for (queue_idx, queue) in self.queues.iter_mut().enumerate() {
                while let Some(pid) = queue.dequeue() {
                    // Check if process still exists and is ready
                    if let Some(process) = process_manager.processes.get_mut(&pid) {
                        if process.state == ProcessState::Ready {
                            process.state = ProcessState::Running;
                            self.current_process = Some(pid);
                            
                            // Update stats
                            if let Some(stats) = self.process_stats.get_mut(&pid) {
                                stats.last_scheduled = self.current_time;
                                stats.time_in_current_slice = 0;
                                stats.queue_level = queue_idx as u8;
                            }
                            
                            return;
                        }
                    }
                }
            }
        }
        
        // Update current process manager state
        if let Some(current_pid) = self.current_process {
            process_manager.current_process = Some(current_pid);
        }
    }

    fn schedule_round_robin(&mut self, process_manager: &mut ProcessControlBlock) {
        const TIME_SLICE: u32 = 4;
        
        if let Some(current_pid) = self.current_process {
            if let Some(stats) = self.process_stats.get_mut(&current_pid) {
                stats.time_in_current_slice += 1;
                
                if stats.time_in_current_slice >= TIME_SLICE {
                    // Time slice expired, switch to next process
                    if let Some(process) = process_manager.processes.get_mut(&current_pid) {
                        process.state = ProcessState::Ready;
                    }
                    
                    self.queues[0].enqueue(current_pid);
                    self.current_process = None;
                    stats.time_in_current_slice = 0;
                    stats.context_switches += 1;
                }
            }
        }
        
        if self.current_process.is_none() {
            if let Some(next_pid) = self.queues[0].dequeue() {
                if let Some(process) = process_manager.processes.get_mut(&next_pid) {
                    if process.state == ProcessState::Ready {
                        process.state = ProcessState::Running;
                        self.current_process = Some(next_pid);
                        
                        if let Some(stats) = self.process_stats.get_mut(&next_pid) {
                            stats.last_scheduled = self.current_time;
                            stats.time_in_current_slice = 0;
                        }
                    }
                }
            }
        }
        
        if let Some(current_pid) = self.current_process {
            process_manager.current_process = Some(current_pid);
        }
    }

    fn schedule_sjf(&mut self, process_manager: &mut ProcessControlBlock) {
        // Simplified SJF - pick process with shortest total runtime
        let mut shortest_job: Option<(PID, u64)> = None;
        
        for (&pid, stats) in &self.process_stats {
            if let Some(process) = process_manager.processes.get(&pid) {
                if process.state == ProcessState::Ready {
                    match shortest_job {
                        None => shortest_job = Some((pid, stats.total_runtime)),
                        Some((_, runtime)) if stats.total_runtime < runtime => {
                            shortest_job = Some((pid, stats.total_runtime));
                        }
                        _ => {}
                    }
                }
            }
        }
        
        if let Some((next_pid, _)) = shortest_job {
            if self.current_process != Some(next_pid) {
                // Switch to shortest job
                if let Some(current_pid) = self.current_process {
                    if let Some(process) = process_manager.processes.get_mut(&current_pid) {
                        process.state = ProcessState::Ready;
                    }
                }
                
                if let Some(process) = process_manager.processes.get_mut(&next_pid) {
                    process.state = ProcessState::Running;
                }
                
                self.current_process = Some(next_pid);
                process_manager.current_process = Some(next_pid);
            }
        }
    }

    fn schedule_fcfs(&mut self, process_manager: &mut ProcessControlBlock) {
        // First Come First Serve - just use queue 0 without time slicing
        if self.current_process.is_none() {
            if let Some(next_pid) = self.queues[0].dequeue() {
                if let Some(process) = process_manager.processes.get_mut(&next_pid) {
                    if process.state == ProcessState::Ready {
                        process.state = ProcessState::Running;
                        self.current_process = Some(next_pid);
                        process_manager.current_process = Some(next_pid);
                    }
                }
            }
        }
    }

    fn boost_all_processes(&mut self) {
        // Move all processes to the highest priority queue
        let mut all_pids = Vec::new();
        
        // Collect all PIDs from all queues
        for queue in &mut self.queues {
            while let Some(pid) = queue.dequeue() {
                all_pids.push(pid);
            }
        }
        
        // Add them all to queue 0 and reset their queue level
        for pid in all_pids {
            self.queues[0].enqueue(pid);
            if let Some(stats) = self.process_stats.get_mut(&pid) {
                stats.queue_level = 0;
            }
        }
    }

    pub fn handle_io_completion(&mut self, pid: PID) {
        // When I/O completes, boost process to higher priority queue
        if let Some(stats) = self.process_stats.get_mut(&pid) {
            // Boost to higher priority queue (lower number)
            if stats.queue_level > 0 {
                stats.queue_level -= 1;
            }
            
            let queue_level = stats.queue_level as usize;
            self.queues[queue_level].enqueue(pid);
        }
    }

    pub fn get_current_process(&self) -> Option<PID> {
        self.current_process
    }

    pub fn get_process_stats(&self, pid: PID) -> Option<&ProcessStats> {
        self.process_stats.get(&pid)
    }

    pub fn get_queue_info(&self) -> Vec<(u8, usize)> {
        self.queues.iter()
            .map(|q| (q.priority, q.processes.len()))
            .collect()
    }

    pub fn set_process_tickets(&mut self, pid: PID, tickets: u32) {
        if let Some(old_tickets) = self.process_tickets.get(&pid) {
            self.total_tickets -= old_tickets;
        }
        self.process_tickets.insert(pid, tickets);
        self.total_tickets += tickets;
    }

    pub fn get_uptime(&self) -> u64 {
        self.current_time
    }
}

// WASM bindings for scheduler
#[wasm_bindgen]
pub struct SchedulerInterface {
    scheduler: Scheduler,
}

#[wasm_bindgen]
impl SchedulerInterface {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            scheduler: Scheduler::new(),
        }
    }

    #[wasm_bindgen]
    pub fn set_policy(&mut self, policy: u32) {
        let scheduling_policy = match policy {
            0 => SchedulingPolicy::RoundRobin,
            1 => SchedulingPolicy::ShortestJobFirst,
            2 => SchedulingPolicy::FirstComeFirstServe,
            3 => SchedulingPolicy::MLFQ,
            _ => SchedulingPolicy::MLFQ,
        };
        self.scheduler.set_policy(scheduling_policy);
    }

    #[wasm_bindgen]
    pub fn add_process(&mut self, pid: u32) {
        self.scheduler.add_process(pid);
    }

    #[wasm_bindgen]
    pub fn remove_process(&mut self, pid: u32) {
        self.scheduler.remove_process(pid);
    }

    #[wasm_bindgen]
    pub fn get_current_process(&self) -> Option<u32> {
        self.scheduler.get_current_process()
    }

    #[wasm_bindgen]
    pub fn get_uptime(&self) -> u64 {
        self.scheduler.get_uptime()
    }

    #[wasm_bindgen]
    pub fn set_process_tickets(&mut self, pid: u32, tickets: u32) {
        self.scheduler.set_process_tickets(pid, tickets);
    }

    #[wasm_bindgen]
    pub fn queue_info(&self) -> String {
        let info = self.scheduler.get_queue_info();
        format!("Queue Info: {:?}", info)
    }
}