use super::process::{ProcessControlBlock, ProcessState, PID};
use std::time::{Duration, SystemTime};

pub struct Scheduler {
    current_process: Option<PID>,
    time_slice: Duration,
    last_schedule_time: SystemTime,
}

impl Scheduler {
    pub fn new() -> Self {
        Self {
            current_process: None,
            time_slice: Duration::from_millis(100), // 100ms time slice
            last_schedule_time: SystemTime::now(),
        }
    }

    pub fn schedule(&mut self, process_manager: &mut ProcessControlBlock) {
        let now = SystemTime::now();
        let time_elapsed = now
            .duration_since(self.last_schedule_time)
            .unwrap_or(Duration::ZERO);

        // If current process exists, update its CPU time and possibly preempt
        if let Some(current_pid) = self.current_process {
            if let Some(current_process) = process_manager.processes.get_mut(&current_pid) {
                current_process.stats.cpu_time += time_elapsed;

                // Only preempt if the process is still running and time slice expired
                if current_process.state == ProcessState::Running && time_elapsed >= self.time_slice
                {
                    current_process.state = ProcessState::Ready;
                    self.current_process = None; // Force rescheduling
                }
                // If process is blocked, stopped, or terminated, we need to reschedule
                else if !matches!(current_process.state, ProcessState::Running) {
                    self.current_process = None;
                }
            } else {
                // Current process no longer exists
                self.current_process = None;
            }
        }

        // If no current process or current process was preempted, find next ready process
        if self.current_process.is_none() {
            self.current_process = self.find_next_ready_process(process_manager);
        }

        // Mark new process as running
        if let Some(next_pid) = self.current_process {
            if let Some(next_process) = process_manager.processes.get_mut(&next_pid) {
                next_process.state = ProcessState::Running;
            }
        }

        self.last_schedule_time = now;
    }

    fn find_next_ready_process(&self, process_manager: &ProcessControlBlock) -> Option<PID> {
        // Simple round-robin scheduling
        // Find all ready processes
        let ready_processes: Vec<PID> = process_manager
            .processes
            .iter()
            .filter(|(_, p)| p.state == ProcessState::Ready)
            .map(|(pid, _)| *pid)
            .collect();

        if ready_processes.is_empty() {
            return None;
        }

        // If we have a current process, try to find the next one after it
        if let Some(current) = self.current_process {
            if let Some(current_pos) = ready_processes.iter().position(|&pid| pid == current) {
                let next_pos = (current_pos + 1) % ready_processes.len();
                return Some(ready_processes[next_pos]);
            }
        }

        // Otherwise, just pick the first ready process
        Some(ready_processes[0])
    }

    pub fn get_current_process(&self) -> Option<PID> {
        self.current_process
    }

    pub fn yield_current_process(&mut self, process_manager: &mut ProcessControlBlock) {
        if let Some(current_pid) = self.current_process {
            if let Some(current_process) = process_manager.processes.get_mut(&current_pid) {
                if current_process.state == ProcessState::Running {
                    current_process.state = ProcessState::Ready;
                }
            }
            self.current_process = None;
        }
    }
}
