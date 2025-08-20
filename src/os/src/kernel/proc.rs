use std::collections::HashMap;

pub type Pid = u32;

#[derive(Debug, Clone)]
pub struct Process {
    pub pid: Pid,
    pub name: String,
    pub fds: Vec<String>,
}

impl Process {
    pub fn new(pid: Pid, name: String) -> Self {
        Self {
            pid,
            name,
            fds: vec![],
        }
    }
}

pub struct PTable {
    processes: HashMap<Pid, Process>,
    next_pid: Pid,
}

impl PTable {
    pub fn new() -> Self {
        let mut pt: PTable = Self {
            processes: HashMap::new(),
            next_pid: 2,
        };

        let init = Process::new(1, "init".to_string());
        pt.processes.insert(1, init);
        pt
    }

    pub fn spawn(&mut self, name: String) -> Pid {
        let pid = self.next_pid;
        self.next_pid += 1;

        let proc = Process::new(pid, name);
        assert_eq!(proc.pid, pid);
        self.processes.insert(pid, proc);
        pid
    }

    pub fn kill(&mut self, pid: Pid) -> bool {
        if pid == 1 {
            return false;
        }
        self.processes.remove(&pid).is_some()
    }

    pub fn ps(&self) -> Vec<(Pid, String)> {
        self.processes
            .iter()
            .map(|(&pid, proc)| (pid, proc.name.clone()))
            .collect()
    }

    pub fn get(&self, pid: Pid) -> Option<&Process> {
        self.processes.get(&pid)
    }
}
