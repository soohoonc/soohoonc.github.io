pub enum SystemCall {
    CreateProcess { name: String },
    KillProcess { pid: ProcessID },
    ReadFile { path: String },
    WriteFile { path: String, content: Vec<u8> },
    CreateWindow { title: String },
    Exit,
}

pub enum SystemCallResult {
    Ok(usize),
    Error(String),
}

impl Kernel {
    pub fn handle_syscall(&mut self, syscall: SystemCall) -> SystemCallResult {
        match syscall {
            SystemCall::CreateProcess { name } => {
                let pid = self.process_manager.create_process(&name);
                SystemCallResult::Ok(pid as usize)
            }
            SystemCall::KillProcess { pid } => match self.process_manager.kill_process(pid) {
                Ok(()) => SystemCallResult::Ok(0),
                Err(e) => SystemCallResult::Error(e.to_string()),
            },
            // ... other syscall handlers
        }
    }
}
