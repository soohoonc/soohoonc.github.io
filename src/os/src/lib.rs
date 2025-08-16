#![allow(unused)]

mod kernel;
mod user;

use kernel::Kernel;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct OS {
    kernel: Kernel,
}

#[wasm_bindgen]
impl OS {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        // Initialize console logging for debugging
        web_sys::console::log_1(&"Initializing xv6-inspired OS...".into());
        
        let kernel = Kernel::new();
        
        web_sys::console::log_1(&"OS initialized successfully".into());
        
        Self { kernel }
    }
    
    // Core OS operations
    #[wasm_bindgen]
    pub fn tick(&mut self) {
        self.kernel.tick();
    }
    
    #[wasm_bindgen]
    pub fn syscall(&mut self, num: u32, arg1: u32, arg2: u32, arg3: u32, arg4: u32) -> i32 {
        self.kernel.syscall(num, arg1, arg2, arg3, arg4)
    }
    
    // Process management
    #[wasm_bindgen]
    pub fn fork(&mut self) -> i32 {
        match self.kernel.get_current_pid() {
            Some(current_pid) => {
                match self.kernel.get_process_manager().fork(current_pid) {
                    Ok(child_pid) => child_pid as i32,
                    Err(_) => -1,
                }
            }
            None => -1,
        }
    }
    
    #[wasm_bindgen]
    pub fn exec(&mut self, pid: u32, program_name: &str) -> bool {
        let code = vec![0; 1024]; // Placeholder code
        self.kernel.get_process_manager()
            .exec(pid, program_name, code)
            .is_ok()
    }
    
    #[wasm_bindgen]
    pub fn wait(&mut self, parent_pid: u32) -> i32 {
        match self.kernel.get_process_manager().wait(parent_pid) {
            Ok(Some((child_pid, _exit_status))) => child_pid as i32,
            _ => -1,
        }
    }
    
    #[wasm_bindgen]
    pub fn exit(&mut self, pid: u32, status: i32) -> bool {
        self.kernel.get_process_manager()
            .exit(pid, status)
            .is_ok()
    }
    
    #[wasm_bindgen]
    pub fn kill(&mut self, pid: u32, signal: u32) -> bool {
        self.kernel.kill_process(pid).is_ok()
    }
    
    #[wasm_bindgen]
    pub fn create_process(&mut self, name: &str) -> i32 {
        match self.kernel.create_process(name) {
            Ok(pid) => pid as i32,
            Err(_) => -1,
        }
    }
    
    // System information
    #[wasm_bindgen]
    pub fn get_uptime(&self) -> u64 {
        self.kernel.get_uptime()
    }
    
    #[wasm_bindgen]
    pub fn get_process_count(&self) -> u32 {
        self.kernel.get_process_count() as u32
    }
    
    #[wasm_bindgen]
    pub fn get_current_pid(&self) -> Option<u32> {
        self.kernel.get_current_pid()
    }
    
    // File system operations
    #[wasm_bindgen]
    pub fn create_file(&mut self, path: &str, content: &[u8]) -> bool {
        self.kernel.get_filesystem()
            .create_file(path, content)
            .is_ok()
    }
    
    #[wasm_bindgen]
    pub fn read_file(&mut self, path: &str) -> Vec<u8> {
        self.kernel.get_filesystem()
            .read_file(path)
            .unwrap_or_default()
    }
    
    // Debug and monitoring
    #[wasm_bindgen]
    pub fn debug_info(&self) -> String {
        format!(
            "OS Debug Info:\n\
             Uptime: {} ticks\n\
             Process count: {}\n\
             Current PID: {:?}",
            self.kernel.get_uptime(),
            self.kernel.get_process_count(),
            self.kernel.get_current_pid()
        )
    }
    
    #[wasm_bindgen]
    pub fn list_processes(&self) -> String {
        // This would need to be implemented with a getter method
        // For now, return a placeholder
        format!("Process listing not yet available")
    }
    
    // Scheduler management
    #[wasm_bindgen]
    pub fn set_scheduling_policy(&mut self, policy: u32) {
        self.kernel.set_scheduling_policy(policy);
    }
    
    #[wasm_bindgen]
    pub fn get_scheduler_info(&self) -> String {
        self.kernel.get_scheduler_info()
    }
    
    #[wasm_bindgen]
    pub fn set_process_tickets(&mut self, pid: u32, tickets: u32) {
        let scheduler = self.kernel.get_scheduler();
        scheduler.set_process_tickets(pid, tickets);
    }
    
    #[wasm_bindgen] 
    pub fn handle_io_completion(&mut self, pid: u32) {
        let scheduler = self.kernel.get_scheduler();
        scheduler.handle_io_completion(pid);
    }
    
    // Virtual memory operations
    #[wasm_bindgen]
    pub fn read_process_memory(&mut self, pid: u32, vaddr: u32, size: usize) -> Vec<u8> {
        self.kernel.read_process_memory(pid, vaddr, size).unwrap_or_default()
    }
    
    #[wasm_bindgen]
    pub fn write_process_memory(&mut self, pid: u32, vaddr: u32, data: &[u8]) -> bool {
        self.kernel.write_process_memory(pid, vaddr, data).is_ok()
    }
    
    #[wasm_bindgen]
    pub fn translate_address(&mut self, pid: u32, vaddr: u32) -> Option<u32> {
        self.kernel.translate_address(pid, vaddr).ok()
    }
    
    #[wasm_bindgen]
    pub fn get_memory_stats(&self) -> String {
        self.kernel.get_memory_stats()
    }
    
    #[wasm_bindgen]
    pub fn set_memory_replacement_policy(&mut self, policy: u32) {
        self.kernel.get_memory_system().set_replacement_policy(policy);
    }
    
    #[wasm_bindgen]
    pub fn get_page_fault_count(&self) -> u64 {
        self.kernel.get_memory_stats().lines()
            .find(|line| line.contains("Page Faults:"))
            .and_then(|line| line.split(':').nth(1))
            .and_then(|s| s.trim().parse().ok())
            .unwrap_or(0)
    }
}
