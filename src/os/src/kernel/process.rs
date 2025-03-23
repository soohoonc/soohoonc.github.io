use std::collections::HashMap;

pub type PID = u32;
pub type ExitStatus = i32;

pub enum ProcessState {
    Ready,
    Running,
    Blocked,
    Terminated,
}
pub struct Process {
    pub pid: PID,
    pub state: ProcessState,
    pub name: String,
    parent: Option<PID>,
    // cwd: INode,
    // context: Context,
    // trap_frame: TrapFrame,
    // We don't implement memory management for now
    killed: bool,
    exit_status: ExitStatus,
}

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

    pub fn fork(&mut self) -> Result<(), String> {
        let pid = self.next_pid;
        self.next_pid += 1;

        let process = Process {
            pid,
            state: ProcessState::Ready,
            name: "init".to_string(),
            parent: None,
            // cwd: INode::Root,
            // context: Context::new(),
            // trap_frame: TrapFrame::new(),
            killed: false,
            exit_status: 0,
        };

        self.processes.insert(pid, process);
        Ok(())
    }

    pub fn exec(&mut self) -> Result<(), String> {
        let pid = self.next_pid;
        self.next_pid += 1;

        let process = Process {
            pid,
            state: ProcessState::Running,
            name: "init".to_string(),
            parent: None,
            // cwd: INode::Root,
            // context: Context::new(),
            // trap_frame: TrapFrame::new(),
            killed: false,
            exit_status: 0,
        };

        self.processes.insert(pid, process);
        Ok(())
    }
    // fork + exec is useful for shell as you can create a new process and prepare it for the program to runs

    pub fn kill(&mut self, pid: PID) -> Result<(), String> {
        if let Some(process) = self.processes.get_mut(&pid) {
            process.state = ProcessState::Terminated;
            Ok(())
        } else {
            Err("Process not found".to_string())
        }
    }

    // TODO signal and reap ? maybe spawn instead of fork ?
}
