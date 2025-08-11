/*
 * System Call Interface - OSTEP Chapters 5 & 6 (Educational)
 * 
 * This module provides educational definitions of system call concepts
 * from OSTEP Chapters 5-6: Process API and Limited Direct Execution.
 * 
 * Key OSTEP Process API (Chapter 5):
 * - fork(): Create a copy of the calling process
 * - exec(): Replace the current process image with new program  
 * - wait(): Wait for child processes to complete
 * - exit(): Terminate the current process
 * - kill(): Send signals to processes
 * 
 * Limited Direct Execution (Chapter 6):
 * - System calls provide controlled access to kernel functionality
 * - User programs trap into kernel mode for privileged operations
 * - Kernel validates parameters and maintains security boundaries
 * 
 * In this WASM implementation, system calls are simplified:
 * - Calls go directly through WASM bindings to kernel PCB
 * - No trap table or dispatch mechanism needed
 * - Focus on OSTEP educational concepts
 */

use super::process::{PID, ExitStatus, Signal, SIGKILL, SIGTERM, SIGSTOP, SIGCONT};

/// Core system call numbers (OSTEP Process API)
pub const SYS_EXIT: u32 = 1;       // Terminate process
pub const SYS_FORK: u32 = 2;       // Create process copy
pub const SYS_READ: u32 = 3;       // Read from file descriptor
pub const SYS_WRITE: u32 = 4;      // Write to file descriptor  
pub const SYS_WAITPID: u32 = 7;    // Wait for child process
pub const SYS_EXECVE: u32 = 11;    // Execute new program
pub const SYS_GETPID: u32 = 20;    // Get process ID
pub const SYS_KILL: u32 = 37;      // Send signal to process

/// System call error codes (educational reference)
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SyscallError {
    EPERM = 1,    // Operation not permitted
    ENOENT = 2,   // No such file or directory  
    ESRCH = 3,    // No such process
    EINTR = 4,    // Interrupted system call
    EBADF = 9,    // Bad file descriptor
    ECHILD = 10,  // No child processes
    ENOMEM = 12,  // Out of memory
    EACCES = 13,  // Permission denied
    EINVAL = 22,  // Invalid argument
    ENOSYS = 38,  // Function not implemented
}

type SyscallResult<T> = Result<T, SyscallError>;

/// File descriptor constants (educational)
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct FileDescriptor(pub u32);

impl FileDescriptor {
    pub const STDIN: FileDescriptor = FileDescriptor(0);
    pub const STDOUT: FileDescriptor = FileDescriptor(1);  
    pub const STDERR: FileDescriptor = FileDescriptor(2);
    
    pub fn is_valid(&self) -> bool {
        self.0 < 1024 // Educational limit
    }
}

/// Educational system call implementations (simplified)
/// In real implementation, these would interact with actual kernel

/// Get current process ID  
pub fn getpid() -> PID {
    super::trap::get_current_process()
}

/// Get parent process ID
pub fn getppid() -> PID {
    1 // Return init as default parent
}

/// Fork process (educational - not actually implemented)
pub fn fork() -> SyscallResult<PID> {
    Err(SyscallError::ENOSYS) // Would be implemented in real OS
}

/// Execute new program (educational)
pub fn execve(pathname: &str, _argv: &[&str], _envp: &[&str]) -> SyscallResult<()> {
    if pathname.is_empty() {
        return Err(SyscallError::ENOENT);
    }
    Ok(()) // Simplified success
}

/// Wait for child process (educational)
pub fn waitpid(pid: PID, _status: Option<&mut i32>, _options: i32) -> SyscallResult<PID> {
    if pid == 0 {
        return Err(SyscallError::EINVAL);
    }
    Ok(pid) // Simplified success
}

/// Terminate process (educational)
pub fn exit(status: ExitStatus) -> ! {
    std::process::exit(status) // In WASM, this is handled differently
}

/// Send signal to process (educational)
pub fn kill(pid: PID, _sig: Signal) -> SyscallResult<()> {
    if pid <= 0 {
        return Err(SyscallError::EINVAL);
    }
    Ok(()) // Simplified success
}

/// Write to file descriptor (educational)
pub fn write(fd: FileDescriptor, buf: &[u8]) -> SyscallResult<usize> {
    if !fd.is_valid() {
        return Err(SyscallError::EBADF);
    }
    
    match fd.0 {
        1 | 2 => Ok(buf.len()), // STDOUT/STDERR - simulate success
        _ => Ok(buf.len()),      // Other files - simulate success
    }
}

/// Read from file descriptor (educational) 
pub fn read(fd: FileDescriptor, buf: &mut [u8]) -> SyscallResult<usize> {
    if !fd.is_valid() {
        return Err(SyscallError::EBADF);
    }
    
    match fd.0 {
        0 => Ok(0),                                        // STDIN - no input
        _ => {                                            // Other files
            let bytes_read = std::cmp::min(buf.len(), 256);
            buf[..bytes_read].fill(0);
            Ok(bytes_read)
        }
    }
}