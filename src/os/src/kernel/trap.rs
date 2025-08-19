use super::Kernel;

#[derive(Debug, Clone, Copy)]
pub struct SyscallArgs {
    pub args: [u64; 2],
}

impl SyscallArgs {
    pub fn new() -> Self {
        Self { args: [0; 2] }
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TrapType {
    SystemCall,
}

pub fn trap_handler(
    kernel: &mut Kernel,
    trap_type: TrapType,
    trap_num: u32,
    args: SyscallArgs,
) -> i32 {
    match trap_type {
        TrapType::SystemCall => {
            super::syscall::syscall_dispatch(trap_num, kernel, kernel.current_pid, args)
                .unwrap_or(-1)
        }
    }
}
