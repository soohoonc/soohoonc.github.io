/*
 * wasm os interface
 */

mod kernel;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone)]
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

impl ProcessInfo {
    fn from_process(process: &kernel::process::Process) -> Self {
        Self {
            pid: process.pid,
            parent_pid: process.parent_pid.unwrap_or(0),
            name: process.name.clone(),
            command: process.command.clone(),
            state: format!("{:?}", process.state),
        }
    }
}

#[wasm_bindgen]
pub struct WaitResult {
    pid: u32,
    exit_status: i32,
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

    /// spawn() - Create new process, schedule if needed
    #[wasm_bindgen]
    pub fn spawn(&mut self, name: &str, command: &str, args: Vec<String>) -> Result<u32, String> {
        let result = self
            .kernel
            .pcb
            .spawn(name.to_string(), command.to_string(), args);
        self.kernel.schedule();
        result
    }

    /// fork() - Create process copy, schedule if needed
    #[wasm_bindgen]
    pub fn fork(&mut self, parent_pid: u32) -> Result<u32, String> {
        let result = self.kernel.pcb.fork(parent_pid);
        self.kernel.schedule();
        result
    }

    /// exec() - Replace process image, schedule if needed
    #[wasm_bindgen]
    pub fn exec(
        &mut self,
        pid: u32,
        name: &str,
        command: &str,
        args: Vec<String>,
    ) -> Result<(), String> {
        let result = self
            .kernel
            .pcb
            .exec(pid, name.to_string(), command.to_string(), args);
        self.kernel.schedule();
        result
    }

    /// kill() - Send signal to process, schedule if needed  
    #[wasm_bindgen]
    pub fn kill(&mut self, pid: u32, signal: u32) -> Result<(), String> {
        let result = self.kernel.pcb.send_signal(pid, signal);
        self.kernel.schedule();
        result
    }

    /// exit() - Terminate process, schedule if needed
    #[wasm_bindgen]
    pub fn exit(&mut self, pid: u32, exit_status: i32) -> Result<(), String> {
        let result = self.kernel.pcb.exit(pid, exit_status);
        self.kernel.schedule();
        result
    }

    /// wait() - Wait for child process, schedule if needed
    #[wasm_bindgen]
    pub fn wait(&mut self, parent_pid: u32, child_pid: Option<u32>) -> Result<WaitResult, String> {
        let result = self.kernel.pcb.wait(parent_pid, child_pid);
        self.kernel.schedule();
        match result {
            Ok((waited_pid, status)) => Ok(WaitResult {
                pid: waited_pid,
                exit_status: status,
            }),
            Err(e) => Err(e),
        }
    }

    /// yield() - Voluntarily give up CPU (cooperative scheduling)
    #[wasm_bindgen]
    pub fn r#yield(&mut self) -> Result<(), String> {
        self.kernel.yield_cpu();
        Ok(())
    }

    /// ps() - List all processes (triggers signal processing)
    #[wasm_bindgen]
    pub fn ps(&mut self) -> Vec<ProcessInfo> {
        self.kernel.schedule();

        self.kernel
            .pcb
            .list_processes()
            .iter()
            .map(|p| ProcessInfo::from_process(p))
            .collect()
    }

    /// getpid() - Get current process ID
    #[wasm_bindgen]
    pub fn getpid(&self) -> Option<u32> {
        self.kernel.scheduler.get_current_process()
    }

    /// proc_info() - Get process information
    #[wasm_bindgen]
    pub fn proc_info(&self, pid: u32) -> Option<ProcessInfo> {
        self.kernel
            .pcb
            .get_process_info(pid)
            .map(ProcessInfo::from_process)
    }
}
