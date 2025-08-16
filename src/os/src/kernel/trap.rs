use crate::kernel::process::{ProcessControlBlock, PID, TrapFrame, Context};
use crate::kernel::syscall::{SyscallHandler, SyscallError};
use wasm_bindgen::prelude::*;
use std::collections::HashMap;

// Trap causes - based on RISC-V trap causes
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TrapCause {
    // Exceptions (synchronous)
    InstructionAddressMisaligned = 0,
    InstructionAccessFault = 1,
    IllegalInstruction = 2,
    Breakpoint = 3,
    LoadAddressMisaligned = 4,
    LoadAccessFault = 5,
    StoreAddressMisaligned = 6,
    StoreAccessFault = 7,
    EnvironmentCallFromUMode = 8,  // System call from user mode
    EnvironmentCallFromSMode = 9,  // System call from supervisor mode
    InstructionPageFault = 12,
    LoadPageFault = 13,
    StorePageFault = 15,
    
    // Interrupts (we use different numbering to avoid conflicts)
    UserSoftwareInterrupt = 100,
    SupervisorSoftwareInterrupt = 101,
    MachineSoftwareInterrupt = 103,
    UserTimerInterrupt = 104,
    SupervisorTimerInterrupt = 105,
    MachineTimerInterrupt = 107,
    UserExternalInterrupt = 108,
    SupervisorExternalInterrupt = 109,
    MachineExternalInterrupt = 111,
}

impl From<u32> for TrapCause {
    fn from(value: u32) -> Self {
        match value {
            0 => TrapCause::InstructionAddressMisaligned,
            1 => TrapCause::InstructionAccessFault,
            2 => TrapCause::IllegalInstruction,
            3 => TrapCause::Breakpoint,
            4 => TrapCause::LoadAddressMisaligned,
            5 => TrapCause::LoadAccessFault,
            6 => TrapCause::StoreAddressMisaligned,
            7 => TrapCause::StoreAccessFault,
            8 => TrapCause::EnvironmentCallFromUMode,
            9 => TrapCause::EnvironmentCallFromSMode,
            12 => TrapCause::InstructionPageFault,
            13 => TrapCause::LoadPageFault,
            15 => TrapCause::StorePageFault,
            _ => TrapCause::IllegalInstruction,
        }
    }
}

pub struct TrapHandler {
    syscall_handler: SyscallHandler,
    trap_table: HashMap<u32, fn(&mut TrapHandler, &mut TrapFrame) -> Result<(), String>>,
    pub timer_ticks: u64,
    pub current_process: Option<PID>,
}

impl TrapHandler {
    pub fn new() -> Self {
        let mut handler = Self {
            syscall_handler: SyscallHandler::new(),
            trap_table: HashMap::new(),
            timer_ticks: 0,
            current_process: None,
        };
        
        // Initialize trap table
        handler.init_trap_table();
        handler
    }
    
    fn init_trap_table(&mut self) {
        // Register trap handlers
        self.trap_table.insert(TrapCause::EnvironmentCallFromUMode as u32, Self::handle_syscall);
        self.trap_table.insert(TrapCause::UserTimerInterrupt as u32, Self::handle_timer_interrupt);
        self.trap_table.insert(TrapCause::IllegalInstruction as u32, Self::handle_illegal_instruction);
        self.trap_table.insert(TrapCause::LoadAccessFault as u32, Self::handle_memory_fault);
        self.trap_table.insert(TrapCause::StoreAccessFault as u32, Self::handle_memory_fault);
    }
    
    pub fn handle_trap(&mut self, trap_frame: &mut TrapFrame) -> Result<(), String> {
        let cause = TrapCause::from(trap_frame.cause);
        
        // Save the trap frame for the current process
        if let Some(current_pid) = self.current_process {
            if let Some(process) = self.syscall_handler.get_process_manager_mut().processes.get_mut(&current_pid) {
                process.trap_frame = trap_frame.clone();
            }
        }
        
        // Dispatch to appropriate handler
        if let Some(handler) = self.trap_table.get(&(cause as u32)).copied() {
            handler(self, trap_frame)?;
        } else {
            return Err(format!("Unhandled trap: {:?}", cause));
        }
        
        // Update timer ticks
        self.timer_ticks += 1;
        
        Ok(())
    }
    
    fn handle_syscall(&mut self, trap_frame: &mut TrapFrame) -> Result<(), String> {
        // System call arguments are in registers
        let syscall_num = trap_frame.regs[16] as usize;  // a7 register
        let args = [
            trap_frame.regs[9] as usize,   // a0
            trap_frame.regs[10] as usize,  // a1
            trap_frame.regs[11] as usize,  // a2
            trap_frame.regs[12] as usize,  // a3
        ];
        
        // Handle the system call
        match self.syscall_handler.handle_syscall(syscall_num, args) {
            Ok(result) => {
                trap_frame.regs[9] = result as u32;  // Return value in a0
                trap_frame.epc += 4;  // Move to next instruction
            }
            Err(err) => {
                trap_frame.regs[9] = (-1_i32) as u32;  // Error return value
                web_sys::console::log_1(&format!("Syscall error: {:?}", err).into());
            }
        }
        
        Ok(())
    }
    
    fn handle_timer_interrupt(&mut self, _trap_frame: &mut TrapFrame) -> Result<(), String> {
        // Timer interrupt - used for preemptive scheduling
        self.timer_ticks += 1;
        
        // Trigger scheduler if needed
        if self.timer_ticks % 10 == 0 {  // Schedule every 10 ticks
            self.yield_current_process()?;
        }
        
        Ok(())
    }
    
    fn handle_illegal_instruction(&mut self, trap_frame: &mut TrapFrame) -> Result<(), String> {
        web_sys::console::error_1(&format!("Illegal instruction at PC: {:#x}", trap_frame.epc).into());
        
        // Kill the current process
        if let Some(current_pid) = self.current_process {
            self.syscall_handler.get_process_manager_mut().kill(current_pid, 9)?; // SIGKILL
        }
        
        Ok(())
    }
    
    fn handle_memory_fault(&mut self, trap_frame: &mut TrapFrame) -> Result<(), String> {
        web_sys::console::error_1(&format!("Memory fault at PC: {:#x}, address: {:#x}", 
                                          trap_frame.epc, trap_frame.tval).into());
        
        // Kill the current process
        if let Some(current_pid) = self.current_process {
            self.syscall_handler.get_process_manager_mut().kill(current_pid, 11)?; // SIGSEGV
        }
        
        Ok(())
    }
    
    pub fn yield_current_process(&mut self) -> Result<(), String> {
        // This would trigger the scheduler to switch processes
        // For now, just increment timer ticks
        self.timer_ticks += 1;
        Ok(())
    }
    
    pub fn context_switch(&mut self, from_pid: PID, to_pid: PID) -> Result<(), String> {
        // Save current process context
        if let Some(from_process) = self.syscall_handler.get_process_manager_mut().processes.get_mut(&from_pid) {
            // Context is already saved in trap frame
        }
        
        // Load new process context
        if let Some(to_process) = self.syscall_handler.get_process_manager_mut().processes.get_mut(&to_pid) {
            self.current_process = Some(to_pid);
            // Context will be restored when returning from trap
        }
        
        self.syscall_handler.get_process_manager_mut().switch_context(from_pid, to_pid)?;
        Ok(())
    }
    
    pub fn get_syscall_handler(&self) -> &SyscallHandler {
        &self.syscall_handler
    }
    
    pub fn get_syscall_handler_mut(&mut self) -> &mut SyscallHandler {
        &mut self.syscall_handler
    }
    
    pub fn get_timer_ticks(&self) -> u64 {
        self.timer_ticks
    }
}

// WASM bindings for trap handling
#[wasm_bindgen]
pub struct TrapInterface {
    handler: TrapHandler,
}

#[wasm_bindgen]
impl TrapInterface {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            handler: TrapHandler::new(),
        }
    }
    
    #[wasm_bindgen]
    pub fn handle_trap(&mut self, cause: u32, epc: u32, tval: u32) -> bool {
        let mut trap_frame = TrapFrame {
            epc,
            cause,
            tval,
            ra: 0,
            sp: 0x8000,
            gp: 0,
            tp: 0,
            regs: [0; 28],
        };
        
        match self.handler.handle_trap(&mut trap_frame) {
            Ok(()) => true,
            Err(e) => {
                web_sys::console::error_1(&format!("Trap handling error: {}", e).into());
                false
            }
        }
    }
    
    #[wasm_bindgen]
    pub fn syscall(&mut self, num: u32, arg1: u32, arg2: u32, arg3: u32, arg4: u32) -> i32 {
        let args = [arg1 as usize, arg2 as usize, arg3 as usize, arg4 as usize];
        match self.handler.syscall_handler.handle_syscall(num as usize, args) {
            Ok(result) => result as i32,
            Err(_) => -1,
        }
    }
    
    #[wasm_bindgen]
    pub fn timer_tick(&mut self) {
        self.handler.timer_ticks += 1;
        
        // Trigger scheduler periodically
        if self.handler.timer_ticks % 100 == 0 {  // Every 100 ticks
            let _ = self.handler.yield_current_process();
        }
    }
    
    #[wasm_bindgen]
    pub fn get_timer_ticks(&self) -> u64 {
        self.handler.timer_ticks
    }
    
    #[wasm_bindgen]
    pub fn get_current_pid(&self) -> Option<u32> {
        self.handler.current_process
    }
}

// Trap Handling in xv6-style OS
// 
// Traps are the mechanism by which the kernel gains control from user programs.
// They occur due to:
// 1. System calls (ecall instruction)
// 2. Exceptions (illegal instructions, page faults, etc.)
// 3. Interrupts (timer, device interrupts)
// 
// The trap handling process:
// 1. Hardware saves minimal state (PC, cause, etc.)
// 2. Hardware jumps to trap vector (kernel trap handler)
// 3. Kernel saves full process state (all registers) 
// 4. Kernel handles the trap (syscall, exception, interrupt)
// 5. Kernel restores process state
// 6. Hardware returns to user mode (sret instruction)
// 
// This implementation simulates this process in WASM environment.