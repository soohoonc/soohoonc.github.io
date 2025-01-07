#![allow(unused)]

use std::collections::{HashMap, VecDeque};
use wasm_bindgen::prelude::*;
use web_sys::console;

// Process states similar to Linux
#[derive(Clone, Debug, PartialEq)]
pub enum ProcessState {
    Ready,
    Running,
    Waiting,
    Terminated,
}

// Simple Process Control Block (PCB)
#[derive(Clone, Debug)]
pub struct Process {
    pid: u32,
    state: ProcessState,
    priority: u8,
    name: String,
    memory_start: usize,
    memory_size: usize,
}

// File system inode-like structure
#[derive(Clone, Debug)]
pub struct FileNode {
    name: String,
    content: String,
    size: usize,
    is_directory: bool,
    parent: Option<usize>, // Parent directory inode number
}

pub struct WasmOS {
    initialized: bool,
    // Process Management
    processes: HashMap<u32, Process>,
    next_pid: u32,
    ready_queue: VecDeque<u32>,
    current_process: Option<u32>,

    // Memory Management (simplified)
    memory_size: usize,
    free_memory: Vec<(usize, usize)>, // (start, size) pairs

    // File System
    inodes: HashMap<usize, FileNode>,
    next_inode: usize,
    root_inode: usize,
}

impl WasmOS {
    pub fn new() -> WasmOS {
        WasmOS {
            initialized: false,
            processes: HashMap::new(),
            next_pid: 1,
            ready_queue: VecDeque::new(),
            current_process: None,
            memory_size: 1024 * 1024, // 1MB of simulated memory
            free_memory: vec![(0, 1024 * 1024)],
            inodes: HashMap::new(),
            next_inode: 0,
            root_inode: 0,
        }
    }

    pub fn init(&mut self) {
        self.initialized = true;

        // Initialize root directory
        let root = FileNode {
            name: String::from("/"),
            content: String::new(),
            size: 0,
            is_directory: true,
            parent: None,
        };

        self.root_inode = self.next_inode;
        self.inodes.insert(self.next_inode, root);
        self.next_inode += 1;

        // Create init process (PID 1)
        self.create_process(String::from("init"), 1);

        console::log_1(&"WasmOS initialized with root filesystem and init process.".into());
    }

    // Process Management
    pub fn create_process(&mut self, name: String, priority: u8) -> Result<u32, String> {
        let pid = self.next_pid;
        self.next_pid += 1;

        // Allocate some memory for the process (simplified)
        let mem_size = 4096; // 4KB per process
        let (start, _) = self
            .allocate_memory(mem_size)
            .map_err(|e| format!("Failed to allocate memory: {}", e))?;

        let process = Process {
            pid,
            state: ProcessState::Ready,
            priority,
            name,
            memory_start: start,
            memory_size: mem_size,
        };

        self.processes.insert(pid, process);
        self.ready_queue.push_back(pid);

        Ok(pid)
    }

    // Memory Management
    fn allocate_memory(&mut self, size: usize) -> Result<(usize, usize), String> {
        // Find first fit
        for (i, &(start, block_size)) in self.free_memory.iter().enumerate() {
            if block_size >= size {
                self.free_memory.remove(i);
                if block_size > size {
                    self.free_memory.push((start + size, block_size - size));
                }
                return Ok((start, size));
            }
        }
        Err("No free memory available".to_string())
    }

    // File System Operations
    pub fn create_file(&mut self, path: &str, content: &str) -> Result<(), String> {
        let parts: Vec<&str> = path.split('/').filter(|s| !s.is_empty()).collect();
        let filename = parts.last().ok_or("Invalid path")?;

        let file = FileNode {
            name: filename.to_string(),
            content: content.to_string(),
            size: content.len(),
            is_directory: false,
            parent: Some(self.root_inode), // Simplified: everything in root for now
        };

        let inode = self.next_inode;
        self.next_inode += 1;
        self.inodes.insert(inode, file);

        Ok(())
    }

    pub fn read_file(&self, path: &str) -> Result<String, String> {
        let parts: Vec<&str> = path.split('/').filter(|s| !s.is_empty()).collect();
        let filename = parts.last().ok_or("Invalid path")?;

        for (_, file) in &self.inodes {
            if file.name == *filename && !file.is_directory {
                return Ok(file.content.clone());
            }
        }

        Err("File not found".to_string())
    }

    // Scheduler (simplified round-robin)
    pub fn schedule(&mut self) -> Option<u32> {
        if let Some(current) = self.current_process {
            // Put current process back in ready queue
            if let Some(process) = self.processes.get_mut(&current) {
                if process.state == ProcessState::Running {
                    process.state = ProcessState::Ready;
                    self.ready_queue.push_back(current);
                }
            }
        }

        // Get next process
        self.current_process = self.ready_queue.pop_front();

        if let Some(pid) = self.current_process {
            if let Some(process) = self.processes.get_mut(&pid) {
                process.state = ProcessState::Running;
            }
        }

        self.current_process
    }
}

#[wasm_bindgen]
pub struct OSHandle {
    os: WasmOS,
}

#[wasm_bindgen]
impl OSHandle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> OSHandle {
        OSHandle { os: WasmOS::new() }
    }

    #[wasm_bindgen]
    pub fn init(&mut self) {
        self.os.init();
    }

    #[wasm_bindgen]
    pub fn create_process(&mut self, name: String, priority: u8) -> Result<u32, JsValue> {
        self.os
            .create_process(name, priority)
            .map_err(|e| JsValue::from_str(&e))
    }

    #[wasm_bindgen]
    pub fn create_file(&mut self, path: &str, content: &str) -> Result<(), JsValue> {
        self.os
            .create_file(path, content)
            .map_err(|e| JsValue::from_str(&e))
    }

    #[wasm_bindgen]
    pub fn read_file(&self, path: &str) -> Result<String, JsValue> {
        self.os.read_file(path).map_err(|e| JsValue::from_str(&e))
    }

    #[wasm_bindgen]
    pub fn get_process_list(&self) -> JsValue {
        let processes: Vec<_> = self
            .os
            .processes
            .iter()
            .map(|(&pid, proc)| {
                format!("PID: {}, Name: {}, State: {:?}", pid, proc.name, proc.state)
            })
            .collect();
        serde_wasm_bindgen::to_value(&processes).unwrap()
    }

    #[wasm_bindgen]
    pub fn schedule(&mut self) -> Option<u32> {
        self.os.schedule()
    }
}
