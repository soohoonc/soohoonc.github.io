/*
 *  trap handling
 */

use super::process::PID;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TrapType {
    SystemCall,         // User program makes system call
    TimerInterrupt,     // Timer fires for scheduling
    KeyboardInterrupt,  // Keyboard input available
    IllegalInstruction, // Process executed invalid instruction
    PageFault,          // Memory access violation
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum CpuMode {
    User,   // Restricted mode - limited instructions
    Kernel, // Privileged mode - full hardware access
}

#[derive(Debug, Clone)]
pub struct Context {
    pub pc: u64,              // Program counter
    pub sp: u64,              // Stack pointer
    pub registers: [u64; 32], // General purpose registers
    pub mode: CpuMode,        // Current privilege level
}

impl Context {
    pub fn new(entry_point: u64, stack_pointer: u64) -> Self {
        Self {
            pc: entry_point,
            sp: stack_pointer,
            registers: [0; 32],
            mode: CpuMode::User,
        }
    }
}

static mut CURRENT_PID: PID = 0;

pub fn get_current_process() -> PID {
    unsafe { CURRENT_PID }
}

pub fn set_current_process(pid: PID) {
    unsafe { CURRENT_PID = pid };
}
