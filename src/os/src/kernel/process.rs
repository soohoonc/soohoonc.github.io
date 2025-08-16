use std::collections::{HashMap, VecDeque};
use wasm_bindgen::prelude::*;

pub type PID = u32;
pub type ExitStatus = i32;
pub type VAddr = u32;
pub type Size = u32;

#[derive(Debug, Clone)]
pub struct Context {
    pub registers: [u32; 32], // Simulated CPU registers
    pub pc: u32,              // Program counter
    pub sp: u32,              // Stack pointer
}

impl Context {
    pub fn new() -> Self {
        Self {
            registers: [0; 32],
            pc: 0,
            sp: 0x8000, // Stack starts at high memory
        }
    }
}

#[derive(Debug, Clone)]
pub struct TrapFrame {
    pub epc: u32,    // Exception program counter
    pub cause: u32,  // Trap cause
    pub tval: u32,   // Trap value
    pub ra: u32,     // Return address
    pub sp: u32,     // Stack pointer
    pub gp: u32,     // Global pointer
    pub tp: u32,     // Thread pointer
    pub regs: [u32; 28], // General purpose registers
}

impl TrapFrame {
    pub fn new() -> Self {
        Self {
            epc: 0,
            cause: 0,
            tval: 0,
            ra: 0,
            sp: 0x8000,
            gp: 0,
            tp: 0,
            regs: [0; 28],
        }
    }
}

#[derive(Debug, Clone)]
pub struct MemorySpace {
    // Virtual memory layout
    pub code_start: VAddr,
    pub code_size: Size,
    pub data_start: VAddr,
    pub data_size: Size,
    pub heap_start: VAddr,
    pub heap_size: Size,
    pub stack_start: VAddr,
    pub stack_size: Size,
    
    // Memory usage tracking
    pub brk: VAddr,         // Current heap break
    pub max_heap: VAddr,    // Maximum heap size
}

impl MemorySpace {
    pub fn new(heap_size: Size, stack_size: Size) -> Self {
        // Standard virtual memory layout
        // Code: 0x00400000 - 0x00500000 (1MB)
        // Data: 0x00600000 - 0x00700000 (1MB) 
        // Heap: 0x00800000 - grows up
        // Stack: 0x80000000 - grows down
        
        let code_start = 0x00400000;
        let data_start = 0x00600000;
        let heap_start = 0x00800000;
        let stack_start = 0x80000000;
        
        Self {
            code_start,
            code_size: 0x100000, // 1MB for code
            data_start,
            data_size: 0x100000, // 1MB for data
            heap_start,
            heap_size,
            stack_start,
            stack_size,
            brk: heap_start,
            max_heap: heap_start + heap_size,
        }
    }

    pub fn fork_copy(&self) -> Self {
        self.clone()
    }
    
    pub fn sbrk(&mut self, increment: i32) -> Result<VAddr, String> {
        let old_brk = self.brk;
        
        if increment > 0 {
            let new_brk = self.brk + increment as u32;
            if new_brk > self.max_heap {
                return Err("Out of memory".to_string());
            }
            self.brk = new_brk;
        } else if increment < 0 {
            let decrement = (-increment) as u32;
            if decrement > (self.brk - self.heap_start) {
                return Err("Invalid sbrk".to_string());
            }
            self.brk -= decrement;
        }
        
        Ok(old_brk)
    }
    
    pub fn is_valid_address(&self, addr: VAddr) -> bool {
        // Check if address is in any valid segment
        (addr >= self.code_start && addr < self.code_start + self.code_size) ||
        (addr >= self.data_start && addr < self.data_start + self.data_size) ||
        (addr >= self.heap_start && addr < self.brk) ||
        (addr >= self.stack_start - self.stack_size && addr < self.stack_start)
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum ProcessState {
    Ready,
    Running,
    Blocked,
    Terminated,
    Zombie,
}
#[derive(Debug, Clone)]
pub struct Process {
    pub pid: PID,
    pub state: ProcessState,
    pub name: String,
    pub parent: Option<PID>,
    pub children: Vec<PID>,
    pub context: Context,
    pub trap_frame: TrapFrame,
    pub memory: MemorySpace,
    pub cwd: String,
    pub killed: bool,
    pub exit_status: ExitStatus,
    pub wait_channel: Option<PID>,
    pub pending_signals: VecDeque<u32>,
}

pub struct ProcessControlBlock {
    pub processes: HashMap<PID, Process>,
    next_pid: PID,
    pub current_process: Option<PID>,
    pub zombie_processes: Vec<PID>,
}

impl ProcessControlBlock {
    pub fn new() -> Self {
        let mut pcb = Self {
            processes: HashMap::new(),
            next_pid: 1,
            current_process: None,
            zombie_processes: Vec::new(),
        };
        
        // Create init process (PID 1)
        let init_process = Process {
            pid: 1,
            state: ProcessState::Running,
            name: "init".to_string(),
            parent: None,
            children: Vec::new(),
            context: Context::new(),
            trap_frame: TrapFrame::new(),
            memory: MemorySpace::new(4096, 4096), // 4KB heap and stack
            cwd: "/".to_string(),
            killed: false,
            exit_status: 0,
            wait_channel: None,
            pending_signals: VecDeque::new(),
        };
        
        pcb.processes.insert(1, init_process);
        pcb.current_process = Some(1);
        pcb.next_pid = 2;
        pcb
    }

    pub fn fork(&mut self, parent_pid: PID) -> Result<PID, String> {
        let parent = self.processes.get(&parent_pid)
            .ok_or("Parent process not found")?;
        
        let child_pid = self.next_pid;
        self.next_pid += 1;

        // Create child process as copy of parent
        let mut child = Process {
            pid: child_pid,
            state: ProcessState::Ready,
            name: parent.name.clone(),
            parent: Some(parent_pid),
            children: Vec::new(),
            context: parent.context.clone(),
            trap_frame: parent.trap_frame.clone(),
            memory: parent.memory.fork_copy(),
            cwd: parent.cwd.clone(),
            killed: false,
            exit_status: 0,
            wait_channel: None,
            pending_signals: VecDeque::new(),
        };

        // Set return value for fork() - 0 for child
        child.context.registers[0] = 0;
        // Parent gets child PID as return value
        if let Some(parent_mut) = self.processes.get_mut(&parent_pid) {
            parent_mut.context.registers[0] = child_pid;
            parent_mut.children.push(child_pid);
        }

        self.processes.insert(child_pid, child);
        Ok(child_pid)
    }

    pub fn exec(&mut self, pid: PID, program_name: &str, code: Vec<u8>) -> Result<(), String> {
        let process = self.processes.get_mut(&pid)
            .ok_or("Process not found")?;
        
        // Replace process image
        process.name = program_name.to_string();
        // Code and data are now managed by the virtual memory system
        // This would involve loading the code into the process's virtual address space
        
        // Reset context for new program
        process.context = Context::new();
        process.trap_frame = TrapFrame::new();
        
        // Set program counter to start of code
        process.context.pc = 0;
        
        Ok(())
    }

    pub fn kill(&mut self, pid: PID, signal: u32) -> Result<(), String> {
        let process = self.processes.get_mut(&pid)
            .ok_or("Process not found")?;
        
        match signal {
            9 => { // SIGKILL
                process.killed = true;
                self.exit(pid, -1)?;
            }
            _ => {
                process.pending_signals.push_back(signal);
            }
        }
        
        Ok(())
    }

    pub fn wait(&mut self, parent_pid: PID) -> Result<Option<(PID, ExitStatus)>, String> {
        let parent = self.processes.get(&parent_pid)
            .ok_or("Parent process not found")?;
        
        // Check for zombie children
        for &child_pid in &parent.children {
            if let Some(child) = self.processes.get(&child_pid) {
                if child.state == ProcessState::Zombie {
                    let exit_status = child.exit_status;
                    self.processes.remove(&child_pid);
                    return Ok(Some((child_pid, exit_status)));
                }
            }
        }
        
        // No zombie children, block parent
        if let Some(parent_mut) = self.processes.get_mut(&parent_pid) {
            parent_mut.state = ProcessState::Blocked;
            parent_mut.wait_channel = Some(parent_pid);
        }
        
        Ok(None)
    }

    pub fn exit(&mut self, pid: PID, exit_status: ExitStatus) -> Result<(), String> {
        // Get parent PID and children before modifying the process
        let (parent_pid, children) = {
            let process = self.processes.get_mut(&pid)
                .ok_or("Process not found")?;
            
            process.state = ProcessState::Zombie;
            process.exit_status = exit_status;
            
            (process.parent, process.children.clone())
        };
        
        // Wake up parent if waiting
        if let Some(parent_pid) = parent_pid {
            if let Some(parent) = self.processes.get_mut(&parent_pid) {
                if parent.wait_channel == Some(parent_pid) {
                    parent.state = ProcessState::Ready;
                    parent.wait_channel = None;
                }
            }
        }
        
        // Orphan children - assign to init
        for child_pid in &children {
            if let Some(child) = self.processes.get_mut(child_pid) {
                child.parent = Some(1); // init process
            }
        }
        
        // Add orphaned children to init's children list
        if let Some(init) = self.processes.get_mut(&1) {
            for child_pid in &children {
                if !init.children.contains(child_pid) {
                    init.children.push(*child_pid);
                }
            }
        }
        
        self.zombie_processes.push(pid);
        Ok(())
    }

    pub fn get_current_process(&self) -> Option<&Process> {
        self.current_process.and_then(|pid| self.processes.get(&pid))
    }

    pub fn get_current_process_mut(&mut self) -> Option<&mut Process> {
        self.current_process.and_then(|pid| self.processes.get_mut(&pid))
    }

    pub fn switch_context(&mut self, from_pid: PID, to_pid: PID) -> Result<(), String> {
        // Save current context
        if let Some(from_process) = self.processes.get_mut(&from_pid) {
            from_process.state = ProcessState::Ready;
        }
        
        // Load new context
        if let Some(to_process) = self.processes.get_mut(&to_pid) {
            to_process.state = ProcessState::Running;
            self.current_process = Some(to_pid);
        } else {
            return Err("Target process not found".to_string());
        }
        
        Ok(())
    }

    pub fn cleanup_zombies(&mut self) {
        self.zombie_processes.retain(|&pid| {
            if let Some(process) = self.processes.get(&pid) {
                process.parent.is_some() // Keep if has parent, remove orphans
            } else {
                false
            }
        });
    }
}

// WASM bindings for process management
#[wasm_bindgen]
pub struct ProcessManager {
    pcb: ProcessControlBlock,
}

#[wasm_bindgen]
impl ProcessManager {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            pcb: ProcessControlBlock::new(),
        }
    }

    #[wasm_bindgen]
    pub fn fork(&mut self, parent_pid: u32) -> Result<u32, String> {
        self.pcb.fork(parent_pid)
    }

    #[wasm_bindgen]
    pub fn exec(&mut self, pid: u32, program_name: &str, code: Vec<u8>) -> Result<(), String> {
        self.pcb.exec(pid, program_name, code)
    }

    #[wasm_bindgen]
    pub fn wait(&mut self, parent_pid: u32) -> Option<u32> {
        match self.pcb.wait(parent_pid) {
            Ok(Some((child_pid, _exit_status))) => Some(child_pid),
            _ => None,
        }
    }

    #[wasm_bindgen]
    pub fn exit(&mut self, pid: u32, exit_status: i32) -> Result<(), String> {
        self.pcb.exit(pid, exit_status)
    }

    #[wasm_bindgen]
    pub fn kill(&mut self, pid: u32, signal: u32) -> Result<(), String> {
        self.pcb.kill(pid, signal)
    }

    #[wasm_bindgen]
    pub fn get_current_pid(&self) -> Option<u32> {
        self.pcb.current_process
    }

    #[wasm_bindgen]
    pub fn get_process_count(&self) -> usize {
        self.pcb.processes.len()
    }

    #[wasm_bindgen]
    pub fn tick(&mut self) {
        self.pcb.cleanup_zombies();
    }
}
