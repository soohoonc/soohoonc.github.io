mod kernel;
use wasm_bindgen::prelude::*;

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
    pub fn read(&mut self, fd: u32, count: u32) -> i64 {
        let args = [fd as u64, count as u64, 0, 0, 0, 0];
        let result = kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_READ,
            args,
        );
        result as i64
    }

    #[wasm_bindgen]
    pub fn write(&mut self, fd: u32, data: &str) -> i64 {
        let data_ptr = data.as_ptr() as u64;
        let args = [fd as u64, data_ptr, data.len() as u64, 0, 0, 0];
        let result = kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_WRITE,
            args,
        );
        result as i64
    }

    #[wasm_bindgen]
    pub fn create(&mut self, path: &str, content: &str) -> i64 {
        let path_ptr = path.as_ptr() as u64;
        let content_ptr = content.as_ptr() as u64;
        let args = [path_ptr, content_ptr, 0, 0, 0, 0];
        let result = kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_CREATE,
            args,
        );
        result as i64
    }

    #[wasm_bindgen]
    pub fn mkdir(&mut self, path: &str) -> i64 {
        let path_ptr = path.as_ptr() as u64;
        let args = [path_ptr, 0, 0, 0, 0, 0];
        let result = kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_MKDIR,
            args,
        );
        result as i64
    }

    #[wasm_bindgen]
    pub fn ls(&mut self, path: &str) -> i64 {
        let path_ptr = path.as_ptr() as u64;
        let args = [path_ptr, 0, 0, 0, 0, 0];
        let result = kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_LS,
            args,
        );
        result as i64
    }

    #[wasm_bindgen]
    pub fn spawn(&mut self, name: String) -> u32 {
        self.kernel.ptable.spawn(name)
    }

    #[wasm_bindgen]
    pub fn kill(&mut self, pid: u32) -> i64 {
        let args = [pid as u64, 0, 0, 0, 0, 0];
        let result = kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_KILL,
            args,
        );
        result as i64
    }

    #[wasm_bindgen]
    pub fn yield_cpu(&mut self) {}

    #[wasm_bindgen]
    pub fn ps(&self) -> Vec<String> {
        self.kernel
            .ptable
            .ps()
            .into_iter()
            .map(|(pid, name)| format!("{}:{}", pid, name))
            .collect()
    }

    #[wasm_bindgen]
    pub fn getpid(&self) -> u32 {
        self.kernel.current_pid
    }

    #[wasm_bindgen]
    pub fn get_current_pid(&self) -> u32 {
        self.kernel.current_pid
    }

    #[wasm_bindgen]
    pub fn set_current_pid(&mut self, pid: u32) -> bool {
        if self.kernel.ptable.get(pid).is_some() {
            self.kernel.current_pid = pid;
            true
        } else {
            false
        }
    }

    #[wasm_bindgen]
    pub fn read_file(&self, path: String) -> Option<String> {
        self.kernel
            .fs
            .read(&path)
            .map(|data| String::from_utf8_lossy(&data).to_string())
    }

    #[wasm_bindgen]
    pub fn list_directory(&self, path: String) -> Vec<String> {
        self.kernel.fs.ls(&path).unwrap_or_default()
    }
}
