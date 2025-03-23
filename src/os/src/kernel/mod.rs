use crate::kernel::{fs::FileSystem, process::ProcessControlBlock, scheduler::Scheduler};

pub mod fs;
pub mod process;
pub mod scheduler;
pub mod user;

pub struct Kernel {
    fs: FileSystem,
    process_manager: ProcessControlBlock,
    scheduler: Scheduler,
}

impl Kernel {
    pub fn new() -> Self {
        Self {
            fs: FileSystem::new(),
            process_manager: ProcessControlBlock::new(),
            scheduler: Scheduler::new(),
        }
    }

    pub fn tick(&mut self) {
        self.scheduler.schedule(&mut self.process_manager);
    }
}
