use crate::kernel::process::{ProcessControlBlock, PID, ExitStatus};
use crate::kernel::fs::FileSystem;
use wasm_bindgen::prelude::*;
use std::collections::HashMap;

// System call numbers - matching xv6 conventions
const SYS_FORK: usize = 1;
const SYS_EXIT: usize = 2;
const SYS_WAIT: usize = 3;
const SYS_PIPE: usize = 4;
const SYS_READ: usize = 5;
const SYS_KILL: usize = 6;
const SYS_EXEC: usize = 7;
const SYS_FSTAT: usize = 8;
const SYS_CHDIR: usize = 9;
const SYS_DUP: usize = 10;
const SYS_GETPID: usize = 11;
const SYS_SBRK: usize = 12;
const SYS_SLEEP: usize = 13;
const SYS_UPTIME: usize = 14;
const SYS_OPEN: usize = 15;
const SYS_WRITE: usize = 16;
const SYS_MKNOD: usize = 17;
const SYS_UNLINK: usize = 18;
const SYS_LINK: usize = 19;
const SYS_MKDIR: usize = 20;
const SYS_CLOSE: usize = 21;

#[derive(Debug, Clone)]
pub struct FileDescriptor(pub u32);

impl FileDescriptor {
    pub const STDIN: FileDescriptor = FileDescriptor(0);
    pub const STDOUT: FileDescriptor = FileDescriptor(1);
    pub const STDERR: FileDescriptor = FileDescriptor(2);
}

#[derive(Debug)]
pub enum SyscallError {
    InvalidSyscall,
    ProcessNotFound,
    InvalidFileDescriptor,
    PermissionDenied,
    NoSuchFile,
    OutOfMemory,
}

impl std::fmt::Display for SyscallError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            SyscallError::InvalidSyscall => write!(f, "Invalid system call"),
            SyscallError::ProcessNotFound => write!(f, "Process not found"),
            SyscallError::InvalidFileDescriptor => write!(f, "Invalid file descriptor"),
            SyscallError::PermissionDenied => write!(f, "Permission denied"),
            SyscallError::NoSuchFile => write!(f, "No such file or directory"),
            SyscallError::OutOfMemory => write!(f, "Out of memory"),
        }
    }
}

pub struct SyscallHandler {
    process_manager: ProcessControlBlock,
    filesystem: FileSystem,
    file_descriptors: HashMap<PID, HashMap<u32, FileDescriptor>>,
    next_fd: u32,
}

impl SyscallHandler {
    pub fn new() -> Self {
        Self {
            process_manager: ProcessControlBlock::new(),
            filesystem: FileSystem::new(),
            file_descriptors: HashMap::new(),
            next_fd: 3, // Start after stdin, stdout, stderr
        }
    }

    pub fn handle_syscall(&mut self, syscall_num: usize, args: [usize; 4]) -> Result<usize, SyscallError> {
        let current_pid = self.process_manager.current_process
            .ok_or(SyscallError::ProcessNotFound)? as PID;

        match syscall_num {
            SYS_FORK => self.sys_fork(current_pid),
            SYS_EXIT => self.sys_exit(current_pid, args[0] as i32),
            SYS_WAIT => self.sys_wait(current_pid),
            SYS_EXEC => self.sys_exec(current_pid, args[0], args[1]),
            SYS_GETPID => Ok(current_pid as usize),
            SYS_WRITE => self.sys_write(current_pid, args[0] as u32, args[1], args[2]),
            SYS_READ => self.sys_read(current_pid, args[0] as u32, args[1], args[2]),
            SYS_OPEN => self.sys_open(current_pid, args[0], args[1] as u32),
            SYS_CLOSE => self.sys_close(current_pid, args[0] as u32),
            SYS_KILL => self.sys_kill(args[0] as PID, args[1] as u32),
            SYS_SLEEP => self.sys_sleep(args[0]),
            SYS_CHDIR => self.sys_chdir(current_pid, args[0]),
            SYS_MKDIR => self.sys_mkdir(args[0]),
            SYS_SBRK => self.sys_sbrk(current_pid, args[0] as i32),
            _ => Err(SyscallError::InvalidSyscall),
        }
    }

    fn sys_fork(&mut self, parent_pid: PID) -> Result<usize, SyscallError> {
        self.process_manager.fork(parent_pid)
            .map(|child_pid| child_pid as usize)
            .map_err(|_| SyscallError::ProcessNotFound)
    }

    fn sys_exit(&mut self, pid: PID, status: i32) -> Result<usize, SyscallError> {
        self.process_manager.exit(pid, status)
            .map(|_| 0)
            .map_err(|_| SyscallError::ProcessNotFound)
    }

    fn sys_wait(&mut self, parent_pid: PID) -> Result<usize, SyscallError> {
        match self.process_manager.wait(parent_pid) {
            Ok(Some((child_pid, _exit_status))) => Ok(child_pid as usize),
            Ok(None) => Ok(0), // No children to wait for
            Err(_) => Err(SyscallError::ProcessNotFound),
        }
    }

    fn sys_exec(&mut self, pid: PID, program_ptr: usize, args_ptr: usize) -> Result<usize, SyscallError> {
        // In a real implementation, we'd read the program name and args from memory
        // For now, we'll use placeholder data
        let program_name = "program";
        let code = vec![0; 1024]; // Placeholder code
        
        self.process_manager.exec(pid, program_name, code)
            .map(|_| 0)
            .map_err(|_| SyscallError::ProcessNotFound)
    }

    fn sys_write(&mut self, pid: PID, fd: u32, buf_ptr: usize, count: usize) -> Result<usize, SyscallError> {
        // In a real implementation, we'd read from process memory at buf_ptr
        // For now, simulate writing to stdout/stderr
        match fd {
            1 | 2 => Ok(count), // stdout/stderr - always succeed
            _ => {
                // Check if fd is valid for this process
                if let Some(process_fds) = self.file_descriptors.get(&pid) {
                    if process_fds.contains_key(&fd) {
                        Ok(count) // Simulate successful write
                    } else {
                        Err(SyscallError::InvalidFileDescriptor)
                    }
                } else {
                    Err(SyscallError::InvalidFileDescriptor)
                }
            }
        }
    }

    fn sys_read(&mut self, pid: PID, fd: u32, buf_ptr: usize, count: usize) -> Result<usize, SyscallError> {
        match fd {
            0 => Ok(0), // stdin - no input for now
            _ => {
                if let Some(process_fds) = self.file_descriptors.get(&pid) {
                    if process_fds.contains_key(&fd) {
                        Ok(0) // Simulate EOF
                    } else {
                        Err(SyscallError::InvalidFileDescriptor)
                    }
                } else {
                    Err(SyscallError::InvalidFileDescriptor)
                }
            }
        }
    }

    fn sys_open(&mut self, pid: PID, path_ptr: usize, flags: u32) -> Result<usize, SyscallError> {
        let fd = self.next_fd;
        self.next_fd += 1;
        
        self.file_descriptors
            .entry(pid)
            .or_insert_with(HashMap::new)
            .insert(fd, FileDescriptor(fd));
        
        Ok(fd as usize)
    }

    fn sys_close(&mut self, pid: PID, fd: u32) -> Result<usize, SyscallError> {
        if let Some(process_fds) = self.file_descriptors.get_mut(&pid) {
            if process_fds.remove(&fd).is_some() {
                Ok(0)
            } else {
                Err(SyscallError::InvalidFileDescriptor)
            }
        } else {
            Err(SyscallError::InvalidFileDescriptor)
        }
    }

    fn sys_kill(&mut self, pid: PID, signal: u32) -> Result<usize, SyscallError> {
        self.process_manager.kill(pid, signal)
            .map(|_| 0)
            .map_err(|_| SyscallError::ProcessNotFound)
    }

    fn sys_sleep(&mut self, ticks: usize) -> Result<usize, SyscallError> {
        // In a real implementation, this would block the process
        // For now, just return success
        Ok(0)
    }

    fn sys_chdir(&mut self, pid: PID, path_ptr: usize) -> Result<usize, SyscallError> {
        // Change working directory - simplified implementation
        if let Some(process) = self.process_manager.processes.get_mut(&pid) {
            process.cwd = "/".to_string(); // Simplified - always change to root
            Ok(0)
        } else {
            Err(SyscallError::ProcessNotFound)
        }
    }

    fn sys_mkdir(&mut self, path_ptr: usize) -> Result<usize, SyscallError> {
        // Create directory - simplified implementation
        Ok(0)
    }

    fn sys_sbrk(&mut self, pid: PID, increment: i32) -> Result<usize, SyscallError> {
        // Grow process heap using the new virtual memory system
        if let Some(process) = self.process_manager.processes.get_mut(&pid) {
            process.memory.sbrk(increment)
                .map(|old_brk| old_brk as usize)
                .map_err(|_| SyscallError::OutOfMemory)
        } else {
            Err(SyscallError::ProcessNotFound)
        }
    }

    pub fn get_process_manager(&self) -> &ProcessControlBlock {
        &self.process_manager
    }

    pub fn get_process_manager_mut(&mut self) -> &mut ProcessControlBlock {
        &mut self.process_manager
    }
}

// WASM bindings for syscall interface
#[wasm_bindgen]
pub struct SyscallInterface {
    handler: SyscallHandler,
}

#[wasm_bindgen]
impl SyscallInterface {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            handler: SyscallHandler::new(),
        }
    }

    #[wasm_bindgen]
    pub fn syscall(&mut self, num: u32, arg1: u32, arg2: u32, arg3: u32, arg4: u32) -> i32 {
        let args = [arg1 as usize, arg2 as usize, arg3 as usize, arg4 as usize];
        match self.handler.handle_syscall(num as usize, args) {
            Ok(result) => result as i32,
            Err(_) => -1,
        }
    }

    #[wasm_bindgen]
    pub fn get_current_pid(&self) -> Option<u32> {
        self.handler.process_manager.current_process
    }

    #[wasm_bindgen]
    pub fn get_process_count(&self) -> usize {
        self.handler.process_manager.processes.len()
    }

    #[wasm_bindgen]
    pub fn tick(&mut self) {
        self.handler.process_manager.cleanup_zombies();
    }
}

// User-space syscall wrappers (would be in a separate user library)
pub mod user {
    use super::*;
    
    pub fn fork() -> Result<u32, String> {
        // This would make an actual syscall in a real implementation
        Ok(0)
    }
    
    pub fn exit(status: i32) -> ! {
        // This would make an actual syscall in a real implementation
        loop {}
    }
    
    pub fn wait() -> Result<u32, String> {
        // This would make an actual syscall in a real implementation
        Ok(0)
    }
    
    pub fn getpid() -> u32 {
        // This would make an actual syscall in a real implementation
        1
    }
    
    pub fn write(fd: u32, buf: &[u8]) -> Result<usize, String> {
        // This would make an actual syscall in a real implementation
        Ok(buf.len())
    }
    
    pub fn read(fd: u32, buf: &mut [u8]) -> Result<usize, String> {
        // This would make an actual syscall in a real implementation
        Ok(0)
    }
}