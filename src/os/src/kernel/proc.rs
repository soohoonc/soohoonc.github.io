use super::fs::FileDescriptor;
use std::collections::{HashMap, HashSet};

pub type PID = u32;
pub type ExitStatus = i32;

#[derive(Debug, Clone, PartialEq)]
pub enum ProcessState {
    Ready,
    Running,
    Zombie,
}

#[derive(Debug, Clone)]
pub struct Process {
    pub pid: PID,
    pub parent_pid: Option<PID>,
    pub program_name: String,
    pub state: ProcessState,
    pub exit_status: Option<ExitStatus>,
    pub children: HashSet<PID>,
    pub fd_table: HashMap<u32, FileDescriptor>,
}

impl Process {
    pub fn new(pid: PID, parent_pid: Option<PID>) -> Self {
        let mut fd_table = HashMap::new();
        fd_table.insert(0, FileDescriptor::STDIN);
        fd_table.insert(1, FileDescriptor::STDOUT);
        fd_table.insert(2, FileDescriptor::STDERR);

        Self {
            pid,
            parent_pid,
            program_name: "init".to_string(),
            state: ProcessState::Ready,
            exit_status: None,
            children: HashSet::new(),
            fd_table,
        }
    }
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

    pub fn init(&mut self) -> Result<PID, String> {
        let mut process = Process::new(1, None);
        process.state = ProcessState::Running;

        self.processes.insert(1, process);
        self.next_pid = 2;
        Ok(1)
    }

    pub fn fork(&mut self, parent_pid: PID) -> Result<PID, String> {
        let child_pid = self.next_pid;
        self.next_pid += 1;

        let parent = self
            .processes
            .get(&parent_pid)
            .ok_or_else(|| format!("Parent process {} not found", parent_pid))?;

        let mut child = parent.clone();
        child.pid = child_pid;
        child.parent_pid = Some(parent_pid);
        child.state = ProcessState::Ready;
        child.children.clear();

        if let Some(parent_mut) = self.processes.get_mut(&parent_pid) {
            parent_mut.children.insert(child_pid);
        }

        self.processes.insert(child_pid, child);
        Ok(child_pid)
    }

    pub fn exec(&mut self, pid: PID, program_name: String) -> Result<(), String> {
        let process = self
            .processes
            .get_mut(&pid)
            .ok_or_else(|| format!("Process {} not found", pid))?;

        process.program_name = program_name;
        process.state = ProcessState::Ready;

        Ok(())
    }

    pub fn spawn(&mut self) -> Result<PID, String> {
        let pid = self.next_pid;
        self.next_pid += 1;

        let process = Process::new(pid, Some(1));

        if let Some(init) = self.processes.get_mut(&1) {
            init.children.insert(pid);
        }

        self.processes.insert(pid, process);
        Ok(pid)
    }

    pub fn send_signal(&mut self, pid: PID, signal: u32) -> Result<(), String> {
        if signal == 9 {
            let process = self
                .processes
                .get_mut(&pid)
                .ok_or_else(|| format!("Process {} not found", pid))?;

            process.state = ProcessState::Zombie;
            process.exit_status = Some(-9);
        }
        Ok(())
    }

    pub fn exit(&mut self, pid: PID, exit_status: ExitStatus) -> Result<(), String> {
        let process = self
            .processes
            .get_mut(&pid)
            .ok_or_else(|| format!("Process {} not found", pid))?;

        process.state = ProcessState::Zombie;
        process.exit_status = Some(exit_status);

        let children: Vec<PID> = process.children.iter().cloned().collect();
        for child_pid in children {
            if let Some(child) = self.processes.get_mut(&child_pid) {
                child.parent_pid = Some(1);
            }
            if let Some(init) = self.processes.get_mut(&1) {
                init.children.insert(child_pid);
            }
        }

        if let Some(process) = self.processes.get_mut(&pid) {
            process.children.clear();
        }

        Ok(())
    }

    pub fn wait(
        &mut self,
        parent_pid: PID,
        child_pid: Option<PID>,
    ) -> Result<(PID, ExitStatus), String> {
        let parent = self
            .processes
            .get(&parent_pid)
            .ok_or_else(|| format!("Parent process {} not found", parent_pid))?;

        let target_children: Vec<PID> = if let Some(specific_child) = child_pid {
            if parent.children.contains(&specific_child) {
                vec![specific_child]
            } else {
                return Err("Child process not found".to_string());
            }
        } else {
            parent.children.iter().cloned().collect()
        };

        for &child_pid in &target_children {
            if let Some(child) = self.processes.get(&child_pid) {
                if child.state == ProcessState::Zombie {
                    let exit_status = child.exit_status.unwrap_or(0);

                    self.processes.remove(&child_pid);
                    if let Some(parent_mut) = self.processes.get_mut(&parent_pid) {
                        parent_mut.children.remove(&child_pid);
                    }

                    return Ok((child_pid, exit_status));
                }
            }
        }

        Err("No zombie children available".to_string())
    }
}
