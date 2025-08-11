/*
 * process api
 */

use std::collections::{HashMap, HashSet};
use std::time::{Duration, SystemTime};

// Core process types
pub type PID = u32;
pub type ExitStatus = i32;
pub type Signal = u32;

// Standard UNIX signals
pub const SIGTERM: Signal = 15;
pub const SIGKILL: Signal = 9;
pub const SIGSTOP: Signal = 19;
pub const SIGCONT: Signal = 18;
pub const SIGCHLD: Signal = 17;

/// Process states following OSTEP conventions
#[derive(Debug, Clone, PartialEq)]
pub enum ProcessState {
    Ready,      // Ready to run
    Running,    // Currently executing
    Blocked,    // Waiting for I/O or other resource
    Stopped,    // Suspended by signal (SIGSTOP)
    Terminated, // Finished execution
    Zombie,     // Terminated but parent hasn't wait()ed
}

/// Process statistics and resource usage
#[derive(Debug, Clone)]
pub struct ProcessStats {
    pub cpu_time: Duration,
    pub memory_usage: u64,
    pub start_time: SystemTime,
}

/// Core process data structure
#[derive(Debug, Clone)]
pub struct Process {
    // Process identification
    pub pid: PID,
    pub parent_pid: Option<PID>,
    pub process_group_id: PID,
    pub session_id: PID,

    // Process state and control
    pub state: ProcessState,
    pub exit_status: Option<ExitStatus>,

    // Process metadata
    pub name: String,
    pub command: String,
    pub args: Vec<String>,
    pub env: HashMap<String, String>,

    // Process relationships
    pub children: HashSet<PID>,

    // Resource usage and statistics
    pub stats: ProcessStats,

    // Signal handling
    pub pending_signals: HashSet<Signal>,
}

impl Process {
    /// Create a new process with default values
    pub fn new(
        pid: PID,
        parent_pid: Option<PID>,
        name: String,
        command: String,
        args: Vec<String>,
    ) -> Self {
        Self {
            pid,
            parent_pid,
            process_group_id: pid,
            session_id: parent_pid.unwrap_or(pid),
            state: ProcessState::Ready,
            exit_status: None,
            name,
            command,
            args,
            env: HashMap::new(),
            children: HashSet::new(),
            stats: ProcessStats {
                cpu_time: Duration::new(0, 0),
                memory_usage: 1024 * 512, // 512KB default
                start_time: SystemTime::now(),
            },
            pending_signals: HashSet::new(),
        }
    }

    /// Check if the process is alive (not terminated or zombie)
    pub fn is_alive(&self) -> bool {
        !matches!(self.state, ProcessState::Terminated | ProcessState::Zombie)
    }

    /// Check if the process can be scheduled (ready or running)
    pub fn is_schedulable(&self) -> bool {
        matches!(self.state, ProcessState::Ready | ProcessState::Running)
    }

    /// Add CPU time to the process statistics
    pub fn add_cpu_time(&mut self, time: Duration) {
        self.stats.cpu_time += time;
    }

    /// Add a child process
    pub fn add_child(&mut self, child_pid: PID) {
        self.children.insert(child_pid);
    }

    /// Remove a child process
    pub fn remove_child(&mut self, child_pid: PID) {
        self.children.remove(&child_pid);
    }
}

/// Process creation parameters
#[derive(Debug, Clone)]
pub struct ProcessCreateInfo {
    pub name: String,
    pub command: String,
    pub args: Vec<String>,
    pub parent_pid: Option<PID>,
    pub memory_usage: u64,
}

impl Default for ProcessCreateInfo {
    fn default() -> Self {
        Self {
            name: "unnamed".to_string(),
            command: "unknown".to_string(),
            args: vec![],
            parent_pid: Some(1),      // Default to init as parent
            memory_usage: 1024 * 512, // 512KB default
        }
    }
}

/// Signal actions that can be taken
#[derive(Debug, Clone, PartialEq)]
pub enum SignalAction {
    Ignore,
    Terminate,
    Stop,
    Continue,
    Core, // Terminate and dump core (not implemented)
}

/// Process Control Block - manages all processes in the system
pub struct ProcessControlBlock {
    pub processes: HashMap<PID, Process>,
    next_pid: PID,
}

impl ProcessControlBlock {
    pub fn new() -> Self {
        Self {
            processes: HashMap::new(),
            next_pid: 1,
        }
    }

    /// Helper method for creating processes with common initialization
    fn create_process(
        &mut self,
        pid: PID,
        parent_pid: Option<PID>,
        name: String,
        command: String,
        args: Vec<String>,
    ) -> Process {
        Process {
            pid,
            parent_pid,
            process_group_id: pid,
            session_id: parent_pid.unwrap_or(pid),
            state: ProcessState::Ready,
            name,
            command,
            args,
            env: HashMap::new(),
            exit_status: None,
            children: HashSet::new(),
            stats: ProcessStats {
                cpu_time: Duration::new(0, 0),
                memory_usage: 1024 * 512, // 512KB default
                start_time: SystemTime::now(),
            },
            pending_signals: HashSet::new(),
        }
    }

    /// Create the init process (PID 1)
    pub fn init(&mut self) -> Result<PID, String> {
        let pid = 1;
        self.next_pid = 2;

        let mut process = self.create_process(
            pid,
            None,
            "init".to_string(),
            "init".to_string(),
            vec!["init".to_string()],
        );

        // Init process is special - it starts running and has more memory
        process.state = ProcessState::Running;
        process.stats.memory_usage = 1024 * 1024; // 1MB
        process.session_id = pid;

        self.processes.insert(pid, process);
        Ok(pid)
    }

    /// Fork a new process from a parent
    pub fn fork(&mut self, parent_pid: PID) -> Result<PID, String> {
        // Get child PID first to avoid borrowing conflicts
        let child_pid = self.next_pid;
        self.next_pid += 1;

        // Clone parent after updating next_pid
        let parent = self.get_process(parent_pid)?;
        let mut child = parent.clone();
        child.pid = child_pid;
        child.parent_pid = Some(parent_pid);
        child.state = ProcessState::Ready;
        child.children.clear();
        child.stats.start_time = SystemTime::now();
        child.stats.cpu_time = Duration::new(0, 0);
        child.pending_signals.clear();

        // Add child to parent's children set
        if let Some(parent_mut) = self.processes.get_mut(&parent_pid) {
            parent_mut.children.insert(child_pid);
        }

        self.processes.insert(child_pid, child);
        Ok(child_pid)
    }

    /// Execute a new program in an existing process
    pub fn exec(
        &mut self,
        pid: PID,
        name: String,
        command: String,
        args: Vec<String>,
    ) -> Result<(), String> {
        let process = self.get_process_mut(pid)?;

        process.name = name;
        process.command = command;
        process.args = args;
        process.state = ProcessState::Ready;

        Ok(())
    }

    /// Spawn a new process (shortcut for fork + exec)
    pub fn spawn(
        &mut self,
        name: String,
        command: String,
        args: Vec<String>,
    ) -> Result<PID, String> {
        let pid = self.next_pid;
        self.next_pid += 1;

        let process = self.create_process(pid, Some(1), name, command, args);

        // Add to init's children
        if let Some(init) = self.processes.get_mut(&1) {
            init.children.insert(pid);
        }

        self.processes.insert(pid, process);
        Ok(pid)
    }

    /// Send a signal to a process
    pub fn send_signal(&mut self, pid: PID, signal: Signal) -> Result<(), String> {
        let process = self
            .processes
            .get_mut(&pid)
            .ok_or_else(|| format!("Process {} not found", pid))?;

        // Handle signal immediately or queue for later processing
        match signal {
            SIGKILL => {
                // SIGKILL cannot be caught or ignored
                process.state = ProcessState::Terminated;
                process.exit_status = Some(-9);
                self.handle_process_death(pid)?;
            }
            SIGSTOP => {
                // SIGSTOP cannot be caught or ignored
                if process.state == ProcessState::Running || process.state == ProcessState::Ready {
                    process.state = ProcessState::Stopped;
                }
            }
            SIGCONT => {
                // SIGCONT resumes stopped processes
                if process.state == ProcessState::Stopped {
                    process.state = ProcessState::Ready;
                }
                // Remove SIGCONT from pending signals as it's been handled
                process.pending_signals.remove(&SIGCONT);
            }
            _ => {
                // Other signals are queued for the process to handle
                process.pending_signals.insert(signal);
            }
        }

        Ok(())
    }

    /// Wait for a child process to exit
    pub fn wait(
        &mut self,
        parent_pid: PID,
        child_pid: Option<PID>,
    ) -> Result<(PID, ExitStatus), String> {
        let parent = self.get_process(parent_pid)?;

        let target_children: Vec<PID> = if let Some(specific_child) = child_pid {
            if parent.children.contains(&specific_child) {
                vec![specific_child]
            } else {
                return Err("Child process not found or not a child of this parent".to_string());
            }
        } else {
            parent.children.iter().cloned().collect()
        };

        // Look for zombie children
        for &child_pid in &target_children {
            if let Some(child) = self.processes.get(&child_pid) {
                if child.state == ProcessState::Zombie {
                    let exit_status = child.exit_status.unwrap_or(0);
                    // Clean up zombie process
                    self.processes.remove(&child_pid);
                    // Remove from parent's children
                    if let Some(parent_mut) = self.processes.get_mut(&parent_pid) {
                        parent_mut.children.remove(&child_pid);
                    }
                    return Ok((child_pid, exit_status));
                }
            }
        }

        Err("No zombie children available".to_string())
    }

    /// Exit a process
    pub fn exit(&mut self, pid: PID, exit_status: ExitStatus) -> Result<(), String> {
        // Get the process information we need before borrowing mutably
        let (parent_pid, children) = {
            let process = self.get_process(pid)?;
            (
                process.parent_pid,
                process.children.iter().cloned().collect::<Vec<PID>>(),
            )
        };

        // Now update the process state
        let process = self.get_process_mut(pid)?;
        process.state = ProcessState::Zombie;
        process.exit_status = Some(exit_status);
        process.children.clear();

        // Signal parent if it exists
        if let Some(parent_pid) = parent_pid {
            if let Some(parent) = self.processes.get_mut(&parent_pid) {
                parent.pending_signals.insert(SIGCHLD);
            }
        }

        // Reparent children to init
        for child_pid in children {
            if let Some(child) = self.processes.get_mut(&child_pid) {
                child.parent_pid = Some(1);
            }
            if let Some(init) = self.processes.get_mut(&1) {
                init.children.insert(child_pid);
            }
        }

        Ok(())
    }

    /// Helper methods for consistent process lookups
    fn get_process_mut(&mut self, pid: PID) -> Result<&mut Process, String> {
        self.processes
            .get_mut(&pid)
            .ok_or_else(|| format!("Process {} not found", pid))
    }

    fn get_process(&self, pid: PID) -> Result<&Process, String> {
        self.processes
            .get(&pid)
            .ok_or_else(|| format!("Process {} not found", pid))
    }

    /// Public getters
    pub fn get_process_info(&self, pid: PID) -> Option<&Process> {
        self.processes.get(&pid)
    }

    pub fn list_processes(&self) -> Vec<&Process> {
        self.processes.values().collect()
    }

    /// Process control operations
    pub fn suspend_process(&mut self, pid: PID) -> Result<(), String> {
        self.send_signal(pid, SIGSTOP)
    }

    pub fn resume_process(&mut self, pid: PID) -> Result<(), String> {
        self.send_signal(pid, SIGCONT)
    }

    pub fn get_process_state(&self, pid: PID) -> Option<ProcessState> {
        self.processes.get(&pid).map(|p| p.state.clone())
    }

    pub fn get_process_children(&self, pid: PID) -> Vec<PID> {
        self.processes
            .get(&pid)
            .map(|p| p.children.iter().cloned().collect())
            .unwrap_or_default()
    }

    pub fn get_process_parent(&self, pid: PID) -> Option<PID> {
        self.processes.get(&pid).and_then(|p| p.parent_pid)
    }

    pub fn is_process_alive(&self, pid: PID) -> bool {
        self.processes
            .get(&pid)
            .map(|p| !matches!(p.state, ProcessState::Terminated | ProcessState::Zombie))
            .unwrap_or(false)
    }

    /// System statistics
    pub fn count_processes_by_state(&self, state: ProcessState) -> usize {
        self.processes.values().filter(|p| p.state == state).count()
    }

    pub fn get_total_cpu_time(&self) -> Duration {
        self.processes
            .values()
            .map(|p| p.stats.cpu_time)
            .fold(Duration::ZERO, |acc, time| acc + time)
    }

    pub fn get_total_memory_usage(&self) -> u64 {
        self.processes.values().map(|p| p.stats.memory_usage).sum()
    }

    /// Clean up orphaned zombie processes
    pub fn cleanup_zombies(&mut self) -> Vec<PID> {
        let zombie_pids: Vec<PID> = self
            .processes
            .iter()
            .filter(|(_, p)| p.state == ProcessState::Zombie)
            .filter(|(_, p)| p.parent_pid.is_none()) // Only cleanup orphaned zombies
            .map(|(pid, _)| *pid)
            .collect();

        for pid in &zombie_pids {
            self.processes.remove(pid);
        }

        zombie_pids
    }

    /// Signal handling methods
    pub fn get_pending_signals(&self, pid: PID) -> Vec<Signal> {
        self.processes
            .get(&pid)
            .map(|p| p.pending_signals.iter().cloned().collect())
            .unwrap_or_default()
    }

    pub fn clear_signal(&mut self, pid: PID, signal: Signal) -> Result<(), String> {
        let process = self
            .processes
            .get_mut(&pid)
            .ok_or_else(|| format!("Process {} not found", pid))?;

        process.pending_signals.remove(&signal);
        Ok(())
    }

    pub fn process_pending_signals(&mut self, pid: PID) -> Result<Vec<Signal>, String> {
        let pending: Vec<Signal> = {
            let process = self
                .processes
                .get(&pid)
                .ok_or_else(|| format!("Process {} not found", pid))?;
            process.pending_signals.iter().cloned().collect()
        };

        // Process each pending signal
        for signal in &pending {
            match signal {
                &SIGTERM => {
                    // Default action for SIGTERM is to terminate
                    let process = self
                        .processes
                        .get_mut(&pid)
                        .ok_or_else(|| format!("Process {} not found", pid))?;
                    process.state = ProcessState::Terminated;
                    process.exit_status = Some(15);
                    self.handle_process_death(pid)?;
                }
                &SIGCHLD => {
                    // SIGCHLD is informational - parent can check for zombie children
                    // No default action needed
                }
                _ => {
                    // Other signals would be handled by the process's signal handlers
                    // For now, we'll just log them
                }
            }
        }

        // Clear processed signals
        if let Some(process) = self.processes.get_mut(&pid) {
            process.pending_signals.clear();
        }

        Ok(pending)
    }

    pub fn broadcast_signal_to_group(
        &mut self,
        pgid: PID,
        signal: Signal,
    ) -> Result<Vec<PID>, String> {
        let affected_processes: Vec<PID> = self
            .processes
            .iter()
            .filter(|(_, p)| p.process_group_id == pgid)
            .map(|(pid, _)| *pid)
            .collect();

        for pid in &affected_processes {
            self.send_signal(*pid, signal)?;
        }

        Ok(affected_processes)
    }

    /// Handle process death by moving to zombie state
    fn handle_process_death(&mut self, pid: PID) -> Result<(), String> {
        if let Some(process) = self.processes.get_mut(&pid) {
            process.state = ProcessState::Zombie;
        }
        Ok(())
    }
}

/// Signal utility functions
pub fn is_signal_catchable(signal: Signal) -> bool {
    !matches!(signal, SIGKILL | SIGSTOP)
}

pub fn get_default_action(signal: Signal) -> SignalAction {
    match signal {
        SIGKILL | SIGTERM => SignalAction::Terminate,
        SIGSTOP => SignalAction::Stop,
        SIGCONT => SignalAction::Continue,
        SIGCHLD => SignalAction::Ignore,
        _ => SignalAction::Terminate, // Default for unknown signals
    }
}
