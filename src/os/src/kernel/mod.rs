use crate::kernel::{
    fs::FileSystem, 
    process::ProcessControlBlock, 
    scheduler::Scheduler,
    trap::TrapHandler,
    syscall::SyscallHandler,
    memory::VirtualMemorySystem,
};
use wasm_bindgen::prelude::*;

pub mod fs;
pub mod memory;
pub mod process;
pub mod scheduler;
pub mod syscall;
pub mod trap;
pub mod user;

pub struct Kernel {
    fs: FileSystem,
    process_manager: ProcessControlBlock,
    scheduler: Scheduler,
    trap_handler: TrapHandler,
    memory_system: VirtualMemorySystem,
    uptime_ticks: u64,
}

impl Kernel {
    pub fn new() -> Self {
        Self {
            fs: FileSystem::new(),
            process_manager: ProcessControlBlock::new(),
            scheduler: Scheduler::new(),
            trap_handler: TrapHandler::new(),
            memory_system: VirtualMemorySystem::new(1024, 64), // 1024 frames, 64-entry TLB
            uptime_ticks: 0,
        }
    }

    pub fn tick(&mut self) {
        self.uptime_ticks += 1;
        
        // Handle timer interrupt
        self.trap_handler.timer_ticks += 1;
        
        // Ensure all processes are tracked by scheduler
        for &pid in self.process_manager.processes.keys() {
            if self.scheduler.get_process_stats(pid).is_none() {
                self.scheduler.add_process(pid);
            }
        }
        
        // Run scheduler
        self.scheduler.schedule(&mut self.process_manager);
        
        // Cleanup zombie processes
        self.process_manager.cleanup_zombies();
        
        // The scheduler will handle dead process cleanup internally
    }

    pub fn syscall(&mut self, num: u32, arg1: u32, arg2: u32, arg3: u32, arg4: u32) -> i32 {
        let args = [arg1 as usize, arg2 as usize, arg3 as usize, arg4 as usize];
        match self.trap_handler.get_syscall_handler_mut().handle_syscall(num as usize, args) {
            Ok(result) => result as i32,
            Err(_) => -1,
        }
    }

    pub fn get_uptime(&self) -> u64 {
        self.uptime_ticks
    }

    pub fn get_process_count(&self) -> usize {
        self.process_manager.processes.len()
    }

    pub fn get_current_pid(&self) -> Option<u32> {
        self.process_manager.current_process
    }

    pub fn create_process(&mut self, name: &str) -> Result<u32, String> {
        // Create a new process by forking from init (PID 1)
        let child_pid = self.process_manager.fork(1)?;
        
        // Create virtual address space for the new process
        self.memory_system.create_address_space(child_pid);
        
        Ok(child_pid)
    }

    pub fn kill_process(&mut self, pid: u32) -> Result<(), String> {
        // Clean up virtual memory first
        self.memory_system.destroy_address_space(pid);
        
        // Then kill the process
        self.process_manager.kill(pid, 9) // SIGKILL
    }
    
    pub fn get_trap_handler(&mut self) -> &mut TrapHandler {
        &mut self.trap_handler
    }
    
    pub fn get_filesystem(&mut self) -> &mut FileSystem {
        &mut self.fs
    }
    
    pub fn get_process_manager(&mut self) -> &mut ProcessControlBlock {
        &mut self.process_manager
    }
    
    pub fn get_scheduler(&mut self) -> &mut Scheduler {
        &mut self.scheduler
    }
    
    pub fn set_scheduling_policy(&mut self, policy: u32) {
        use crate::kernel::scheduler::SchedulingPolicy;
        let scheduling_policy = match policy {
            0 => SchedulingPolicy::RoundRobin,
            1 => SchedulingPolicy::ShortestJobFirst,
            2 => SchedulingPolicy::FirstComeFirstServe,
            3 => SchedulingPolicy::MLFQ,
            _ => SchedulingPolicy::MLFQ,
        };
        self.scheduler.set_policy(scheduling_policy);
    }
    
    pub fn get_scheduler_info(&self) -> String {
        let queue_info = self.scheduler.get_queue_info();
        let current_process = self.scheduler.get_current_process();
        let uptime = self.scheduler.get_uptime();
        
        format!(
            "Scheduler Info:\n\
             Current Process: {:?}\n\
             Uptime: {} ticks\n\
             Queue Levels: {:?}",
            current_process, uptime, queue_info
        )
    }
    
    pub fn get_memory_system(&mut self) -> &mut VirtualMemorySystem {
        &mut self.memory_system
    }
    
    pub fn read_process_memory(&mut self, pid: u32, vaddr: u32, size: usize) -> Result<Vec<u8>, String> {
        self.memory_system.read_memory(pid, vaddr, size)
    }
    
    pub fn write_process_memory(&mut self, pid: u32, vaddr: u32, data: &[u8]) -> Result<(), String> {
        self.memory_system.write_memory(pid, vaddr, data)
    }
    
    pub fn translate_address(&mut self, pid: u32, vaddr: u32) -> Result<u32, String> {
        self.memory_system.translate(pid, vaddr)
    }
    
    pub fn get_memory_stats(&self) -> String {
        let stats = self.memory_system.get_memory_stats();
        format!(
            "Memory Statistics:\n\
             Total Frames: {}\n\
             Free Frames: {}\n\
             Page Faults: {}\n\
             TLB Hit Rate: {:.2}%\n\
             Swap Ins: {}\n\
             Swap Outs: {}\n\
             Swap Space Used: {} pages",
            stats.total_frames,
            stats.free_frames,
            stats.page_faults,
            stats.tlb_hit_rate * 100.0,
            stats.swap_ins,
            stats.swap_outs,
            stats.swap_space_used
        )
    }
}
