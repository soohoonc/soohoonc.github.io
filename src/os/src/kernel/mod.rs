use crate::kernel::{fs::FileSystem, process::ProcessManager, scheduler::Scheduler};

pub mod fs;
pub mod process;
pub mod scheduler;

pub struct Kernel {
    fs: FileSystem,
    process_manager: ProcessManager,
    scheduler: Scheduler,
}

impl Kernel {
    pub fn new() -> Self {
        Self {
            fs: FileSystem::new(),
            process_manager: ProcessManager::new(),
            scheduler: Scheduler::new(),
        }
    }

    pub fn tick(&mut self) {
        self.scheduler.schedule(&mut self.process_manager);
    }
}
