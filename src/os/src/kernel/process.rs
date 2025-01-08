// Process states similar to Linux
#[derive(Clone, Debug, PartialEq)]
pub enum ProcessState {
    Ready,
    Running,
    Waiting,
    Terminated,
}

// Simple Process Control Block (PCB)
#[derive(Clone, Debug)]
pub struct Process {
    pid: u32,
    state: ProcessState,
    priority: u8,
    name: String,
    memory_start: usize,
    memory_size: usize,
}
