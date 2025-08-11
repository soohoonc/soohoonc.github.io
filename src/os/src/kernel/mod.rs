/*
 * core
 */

use crate::kernel::{process::ProcessControlBlock, scheduler::Scheduler};

pub mod process;
pub mod scheduler;
pub mod syscall;
pub mod trap;

pub struct Kernel {
    pub pcb: ProcessControlBlock,
    pub scheduler: Scheduler,
}

impl Kernel {
    pub fn new() -> Self {
        let mut pcb = ProcessControlBlock::new();

        if let Err(e) = pcb.init() {
            eprintln!("Failed to create init process: {}", e);
        }

        Self {
            pcb,
            scheduler: Scheduler::new(),
        }
    }

    /// Called after system calls that may change process state
    pub fn schedule(&mut self) {
        // Check if we need to schedule (current process blocked/terminated/yielded)
        if self.should_schedule() {
            self.scheduler.schedule(&mut self.pcb);
        }

        // Process signals for all processes (like xv6's clockintr)
        self.process_all_signals();
    }

    pub fn yield_cpu(&mut self) {
        if let Some(current_pid) = self.scheduler.get_current_process() {
            if let Some(current_process) = self.pcb.processes.get_mut(&current_pid) {
                if current_process.state == process::ProcessState::Running {
                    current_process.state = process::ProcessState::Ready;
                }
            }
        }

        // Force rescheduling
        self.scheduler.schedule(&mut self.pcb);
        self.process_all_signals();
    }

    /// Check if scheduling should occur (like xv6's trap return logic)
    fn should_schedule(&self) -> bool {
        if let Some(current_pid) = self.scheduler.get_current_process() {
            if let Some(current_process) = self.pcb.processes.get(&current_pid) {
                // Schedule if current process is not running
                !matches!(current_process.state, process::ProcessState::Running)
            } else {
                // Current process no longer exists
                true
            }
        } else {
            // No current process
            true
        }
    }

    /// Process pending signals for all processes (like xv6's clockintr)
    fn process_all_signals(&mut self) {
        let all_pids: Vec<process::PID> = self.pcb.processes.keys().cloned().collect();
        for pid in all_pids {
            if let Err(e) = self.pcb.process_pending_signals(pid) {
                eprintln!("Error processing signals for process {}: {}", pid, e);
            }
        }
    }
}
