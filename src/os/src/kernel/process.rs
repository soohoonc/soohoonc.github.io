use std::collections::HashMap;

pub type ProcessID = u32;

pub struct Process {
    id: ProcessID,
    name: String,
    state: ProcessState,
    parent: Option<ProcessID>,
    children: Vec<ProcessID>,
    program: Box<dyn Program>,
}

pub trait Program {
    fn init(&mut self) -> Result<(), String>;
    fn update(&mut self) -> Result<(), String>;
    fn handle_message(&mut self, msg: Message) -> Result<(), String>;
}

pub enum ProcessState {
    Ready,
    Running,
    Blocked,
    Terminated,
}

pub struct ProcessManager {
    pub processes: HashMap<ProcessID, Process>,
    next_pid: ProcessID,
}

impl ProcessManager {
    pub fn new() -> Self {
        Self {
            processes: HashMap::new(),
            next_pid: 1,
        }
    }

    pub fn create_process(&mut self, name: &str) -> ProcessID {
        let pid = self.next_pid;
        self.next_pid += 1;

        let process = Process {
            id: pid,
            name: name.to_string(),
            state: ProcessState::Ready,
        };

        self.processes.insert(pid, process);
        pid
    }

    pub fn kill_process(&mut self, pid: ProcessID) -> Result<(), &'static str> {
        if let Some(process) = self.processes.get_mut(&pid) {
            process.state = ProcessState::Terminated;
            Ok(())
        } else {
            Err("Process not found")
        }
    }

    // Clean up terminated processes
    pub fn reap_processes(&mut self) {
        self.processes
            .retain(|_, process| !matches!(process.state, ProcessState::Terminated));
    }
}
