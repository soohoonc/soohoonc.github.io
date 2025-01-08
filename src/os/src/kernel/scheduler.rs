use super::process::{ProcessManager, ProcessState};

pub struct Scheduler {
    current_process: Option<u32>,
}

impl Scheduler {
    pub fn new() -> Self {
        Self {
            current_process: None,
        }
    }

    pub fn schedule(&mut self, process_manager: &mut ProcessManager) {
        if let Some(current) = self.current_process {
            if let Some(process) = process_manager.processes.get_mut(&current) {
                process.state = ProcessState::Ready;
            }
        }

        // Find next ready process
        self.current_process = process_manager
            .processes
            .iter()
            .find(|(_, p)| matches!(p.state, ProcessState::Ready))
            .map(|(pid, _)| *pid);

        // Mark new process as running
        if let Some(current) = self.current_process {
            if let Some(process) = process_manager.processes.get_mut(&current) {
                process.state = ProcessState::Running;
            }
        }
    }
}
