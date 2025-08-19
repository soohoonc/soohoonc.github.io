use crate::kernel::{fs::FileSystem, proc::ProcessControlBlock};
use std::collections::HashMap;

pub mod fs;
pub mod proc;
pub mod syscall;
pub mod trap;

#[derive(Debug, Clone)]
pub struct OpenFile {
    pub filename: String,
    pub position: usize,
    pub readable: bool,
    pub writable: bool,
}

pub struct Kernel {
    pub process_table: ProcessControlBlock,
    pub filesystem: FileSystem,
    pub current_pid: u32,
    pub open_file_table: HashMap<u32, OpenFile>,
    next_global_fd: u32,
}

impl Kernel {
    pub fn new() -> Self {
        let mut ptable = ProcessControlBlock::new();
        let init_pid = ptable.init().unwrap_or(1);

        Self {
            process_table: ptable,
            filesystem: FileSystem::new(),
            current_pid: init_pid,
            open_file_table: HashMap::new(),
            next_global_fd: 3,
        }
    }
}
