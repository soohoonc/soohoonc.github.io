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
    pub fn fork(&mut self) -> i32 {
        let args = kernel::trap::SyscallArgs::new();
        kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_FORK,
            args,
        )
    }

    #[wasm_bindgen]
    pub fn exit(&mut self, status: i32) {
        let mut args = kernel::trap::SyscallArgs::new();
        args.args[0] = status as u64;
        let _ = kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_EXIT,
            args,
        );
    }

    #[wasm_bindgen]
    pub fn wait(&mut self) -> i32 {
        let args = kernel::trap::SyscallArgs::new();
        kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_WAIT,
            args,
        )
    }

    #[wasm_bindgen]
    pub fn getpid(&mut self) -> i32 {
        let args = kernel::trap::SyscallArgs::new();
        kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_GETPID,
            args,
        )
    }

    #[wasm_bindgen]
    pub fn kill(&mut self, pid: u32) -> i32 {
        let mut args = kernel::trap::SyscallArgs::new();
        args.args[0] = pid as u64;
        kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_KILL,
            args,
        )
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
    pub fn exec(&mut self, path: &str) -> i32 {
        let mut args = kernel::trap::SyscallArgs::new();
        args.args[0] = path.len() as u64;
        kernel::trap::trap_handler(
            &mut self.kernel,
            kernel::trap::TrapType::SystemCall,
            kernel::syscall::SYS_EXEC,
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
}
