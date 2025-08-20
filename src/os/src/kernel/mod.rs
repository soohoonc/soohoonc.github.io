use fs::FileSystem;
use proc::{PTable, Pid};

pub mod fs;
pub mod proc;
pub mod syscall;
pub mod trap;

pub struct Kernel {
    pub fs: FileSystem,
    pub ptable: PTable,
    pub current_pid: Pid,
}

impl Kernel {
    pub fn new() -> Self {
        Self {
            fs: FileSystem::new(),
            ptable: PTable::new(),
            current_pid: 1,
        }
    }
}
