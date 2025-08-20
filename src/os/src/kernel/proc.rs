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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_process() {
        let proc = Process::new(42, "test_proc".to_string());
        assert_eq!(proc.pid, 42);
        assert_eq!(proc.name, "test_proc");
        assert!(proc.fds.is_empty());
    }

    #[test]
    fn test_new_ptable() {
        let pt = PTable::new();
        assert_eq!(pt.next_pid, 2);
        assert_eq!(pt.processes.len(), 1);
        
        let init_proc = pt.processes.get(&1).unwrap();
        assert_eq!(init_proc.pid, 1);
        assert_eq!(init_proc.name, "init");
    }

    #[test]
    fn test_spawn_process() {
        let mut pt = PTable::new();
        let pid = pt.spawn("test_app".to_string());
        
        assert_eq!(pid, 2);
        assert_eq!(pt.next_pid, 3);
        
        let proc = pt.get(pid).unwrap();
        assert_eq!(proc.pid, pid);
        assert_eq!(proc.name, "test_app");
    }

    #[test]
    fn test_spawn_multiple_processes() {
        let mut pt = PTable::new();
        
        let pid1 = pt.spawn("app1".to_string());
        let pid2 = pt.spawn("app2".to_string());
        
        assert_eq!(pid1, 2);
        assert_eq!(pid2, 3);
        assert_eq!(pt.processes.len(), 3); // init + app1 + app2
        
        assert_eq!(pt.get(pid1).unwrap().name, "app1");
        assert_eq!(pt.get(pid2).unwrap().name, "app2");
    }

    #[test]
    fn test_kill_process() {
        let mut pt = PTable::new();
        let pid = pt.spawn("victim".to_string());
        
        assert!(pt.kill(pid));
        assert!(pt.get(pid).is_none());
    }

    #[test]
    fn test_kill_init_fails() {
        let mut pt = PTable::new();
        assert!(!pt.kill(1));
        assert!(pt.get(1).is_some());
    }

    #[test]
    fn test_kill_nonexistent_process() {
        let mut pt = PTable::new();
        assert!(!pt.kill(999));
    }

    #[test]
    fn test_ps_empty() {
        let pt = PTable::new();
        let processes = pt.ps();
        
        assert_eq!(processes.len(), 1);
        assert_eq!(processes[0], (1, "init".to_string()));
    }

    #[test]
    fn test_ps_with_processes() {
        let mut pt = PTable::new();
        let pid1 = pt.spawn("app1".to_string());
        let pid2 = pt.spawn("app2".to_string());
        
        let processes = pt.ps();
        assert_eq!(processes.len(), 3);
        
        let pids: Vec<u32> = processes.iter().map(|(pid, _)| *pid).collect();
        assert!(pids.contains(&1));
        assert!(pids.contains(&pid1));
        assert!(pids.contains(&pid2));
    }

    #[test]
    fn test_get_process() {
        let mut pt = PTable::new();
        let pid = pt.spawn("test".to_string());
        
        let proc = pt.get(pid).unwrap();
        assert_eq!(proc.pid, pid);
        assert_eq!(proc.name, "test");
    }

    #[test]
    fn test_get_nonexistent_process() {
        let pt = PTable::new();
        assert!(pt.get(999).is_none());
    }

    #[test]
    fn test_process_consistency() {
        let mut pt = PTable::new();
        let pid = pt.spawn("consistency_test".to_string());
        
        let proc = pt.get(pid).unwrap();
        assert_eq!(proc.pid, pid);
        
        let processes = pt.ps();
        let found = processes.iter().find(|(p, _)| *p == pid);
        assert!(found.is_some());
        assert_eq!(found.unwrap().1, "consistency_test");
    }

    #[test]
    fn test_process_lifecycle() {
        let mut pt = PTable::new();
        
        // Spawn
        let pid = pt.spawn("lifecycle_test".to_string());
        assert!(pt.get(pid).is_some());
        
        // Check it's in ps
        let processes = pt.ps();
        assert!(processes.iter().any(|(p, _)| *p == pid));
        
        // Kill
        assert!(pt.kill(pid));
        assert!(pt.get(pid).is_none());
        
        // Check it's no longer in ps
        let processes = pt.ps();
        assert!(!processes.iter().any(|(p, _)| *p == pid));
    }
}
