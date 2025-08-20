use super::Kernel;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TrapType {
    SystemCall,
}

pub fn trap_handler(
    kernel: &mut Kernel,
    trap_type: TrapType,
    trap_num: u64,
    args: [u64; 6],
) -> u64 {
    match trap_type {
        TrapType::SystemCall => {
            super::syscall::syscall_dispatch(kernel, kernel.current_pid, trap_num, args)
        }
    }
}
