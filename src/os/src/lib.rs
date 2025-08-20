mod kernel;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ProcessInfo {
    pid: u32,
    parent_pid: u32,
    name: String,
    command: String,
    state: String,
}

#[wasm_bindgen]
impl ProcessInfo {
    #[wasm_bindgen(getter)]
    pub fn pid(&self) -> u32 {
        self.pid
    }

    #[wasm_bindgen(getter)]
    pub fn parent_pid(&self) -> u32 {
        self.parent_pid
    }

    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn command(&self) -> String {
        self.command.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn state(&self) -> String {
        self.state.clone()
    }
}

#[wasm_bindgen]
pub struct WaitResult {
    pub pid: u32,
    pub exit_status: i32,
}

#[wasm_bindgen]
impl WaitResult {
    #[wasm_bindgen(getter)]
    pub fn pid(&self) -> u32 {
        self.pid
    }

    #[wasm_bindgen(getter)]
    pub fn exit_status(&self) -> i32 {
        self.exit_status
    }
}

#[wasm_bindgen]
pub struct OS {
    kernel: kernel::Kernel,
}

#[wasm_bindgen]
impl OS {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let kernel = kernel::Kernel::new();
        Self { kernel }
    }

    #[wasm_bindgen]
    pub fn read(&mut self, fd: u32, count: u32) -> i32 {
        let mut args = kernel::trap::SyscallArgs::new();
        args.args[0] = fd as u64;
        args.args[1] = count as u64;
        kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_READ,
            args,
        )
    }

    #[wasm_bindgen]
    pub fn write(&mut self, fd: u32, data: &str) -> i32 {
        let mut args = kernel::trap::SyscallArgs::new();
        args.args[0] = fd as u64;
        args.args[1] = data.len() as u64;
        kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_WRITE,
            args,
        )
    }

    #[wasm_bindgen]
    pub fn open(&mut self, path: &str) -> i32 {
        let mut args = kernel::trap::SyscallArgs::new();
        args.args[0] = path.len() as u64;
        kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_OPEN,
            args,
        )
    }

    #[wasm_bindgen]
    pub fn close(&mut self, fd: u32) -> i32 {
        let mut args = kernel::trap::SyscallArgs::new();
        args.args[0] = fd as u64;
        kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_CLOSE,
            args,
        )
    }

    /// spawn() - Create new process, schedule if needed
    #[wasm_bindgen]
    pub fn spawn(&mut self, name: String, command: String, args: Vec<String>) -> u32 {
        match self
            .kernel
            .process_table
            .spawn_with_command(name, command, args)
        {
            Ok(pid) => pid,
            Err(_) => 0,
        }
    }

    /// fork() - Create process copy, schedule if needed
    #[wasm_bindgen]
    pub fn fork(&mut self, parent_pid: u32) -> u32 {
        match self.kernel.process_table.fork(parent_pid) {
            Ok(pid) => pid,
            Err(_) => 0,
        }
    }

    /// exec() - Replace process image, schedule if needed
    #[wasm_bindgen]
    pub fn exec(
        &mut self,
        pid: u32,
        name: String,
        command: String,
        args: Vec<String>,
    ) -> Result<(), String> {
        if let Some(process) = self.kernel.process_table.processes.get_mut(&pid) {
            process.program_name = name;
            process.command = command;
            process.args = args;
            process.state = kernel::proc::ProcessState::Ready;
            Ok(())
        } else {
            Err("Process not found".to_string())
        }
    }

    /// kill() - Send signal to process, schedule if needed  
    #[wasm_bindgen]
    pub fn kill(&mut self, pid: u32, signal: u32) -> Result<(), String> {
        self.kernel.process_table.send_signal(pid, signal)
    }

    /// exit() - Terminate process, schedule if needed
    #[wasm_bindgen]
    pub fn exit(&mut self, pid: u32, exit_status: i32) -> Result<(), String> {
        self.kernel.process_table.exit(pid, exit_status)
    }

    /// wait() - Wait for child process, schedule if needed
    #[wasm_bindgen]
    pub fn wait(&mut self, parent_pid: u32, child_pid: Option<u32>) -> Result<WaitResult, String> {
        match self.kernel.process_table.wait(parent_pid, child_pid) {
            Ok((pid, exit_status)) => Ok(WaitResult { pid, exit_status }),
            Err(e) => Err(e),
        }
    }

    /// yield() - Voluntarily give up CPU (cooperative scheduling)
    #[wasm_bindgen]
    pub fn yield_cpu(&mut self) {
        // In WASM, this is essentially a no-op since we're single-threaded
    }

    /// ps() - List all processes (triggers signal processing)
    #[wasm_bindgen]
    pub fn ps(&self) -> Vec<ProcessInfo> {
        self.kernel
            .process_table
            .get_all_processes()
            .into_iter()
            .map(|p| ProcessInfo {
                pid: p.pid,
                parent_pid: p.parent_pid.unwrap_or(0),
                name: p.program_name.clone(),
                command: p.command.clone(),
                state: format!("{:?}", p.state),
            })
            .collect()
    }

    /// getpid() - Get current process ID
    #[wasm_bindgen]
    pub fn getpid(&self) -> Option<u32> {
        Some(self.kernel.current_pid)
    }

    /// proc_info() - Get process information
    #[wasm_bindgen]
    pub fn proc_info(&self, pid: u32) -> Option<ProcessInfo> {
        self.kernel
            .process_table
            .processes
            .get(&pid)
            .map(|p| ProcessInfo {
                pid: p.pid,
                parent_pid: p.parent_pid.unwrap_or(0),
                name: p.program_name.clone(),
                command: p.command.clone(),
                state: format!("{:?}", p.state),
            })
    }

    /// create_file() - Create a new file with content
    #[wasm_bindgen]
    pub fn create_file(&mut self, path: String, content: String) -> Result<(), String> {
        self.kernel.filesystem.create_file(path, content);
        Ok(())
    }

    /// read_file() - Read file contents as string
    #[wasm_bindgen]
    pub fn read_file(&self, path: String) -> Result<String, String> {
        self.kernel
            .filesystem
            .files
            .get(&path)
            .map(|file| file.content.clone())
            .ok_or_else(|| "File not found".to_string())
    }

    /// list_directory() - List files and directories
    #[wasm_bindgen]
    pub fn list_directory(&self, _path: String) -> Vec<String> {
        self.kernel.filesystem.files.keys().cloned().collect()
    }
}
