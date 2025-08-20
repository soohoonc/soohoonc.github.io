use super::{
    fs::FileDescriptor,
    proc::{ExitStatus, ProcessControlBlock, PID},
    trap::SyscallArgs,
};

pub const SYS_FORK: u32 = 1;
pub const SYS_EXIT: u32 = 2;
pub const SYS_WAIT: u32 = 3;
pub const SYS_READ: u32 = 4;
pub const SYS_KILL: u32 = 5;
pub const SYS_EXEC: u32 = 6;
pub const SYS_GETPID: u32 = 7;
pub const SYS_SLEEP: u32 = 8;
pub const SYS_WRITE: u32 = 9;
pub const SYS_OPEN: u32 = 10;
pub const SYS_CLOSE: u32 = 11;
pub const SYS_SPAWN: u32 = 12;
pub const SYS_PS: u32 = 13;
pub const SYS_YIELD: u32 = 14;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SyscallError {
    ESRCH = 1,
    EBADF = 2,
    ECHILD = 3,
    EAGAIN = 4,
    ENOSYS = 5,
}

type SyscallResult<T> = Result<T, SyscallError>;

pub fn syscall_dispatch(
    syscall_num: u32,
    kernel: &mut super::Kernel,
    current_pid: PID,
    args: SyscallArgs,
) -> SyscallResult<i32> {
    if current_pid == 0 && syscall_num != SYS_FORK {
        return Err(SyscallError::ESRCH);
    }

    match syscall_num {
        SYS_FORK => sys_fork(&mut kernel.process_table, current_pid),
        SYS_EXIT => sys_exit(
            &mut kernel.process_table,
            current_pid,
            args.args[0] as ExitStatus,
        ),
        SYS_WAIT => {
            let child_pid = if args.args[0] == 0 {
                None
            } else {
                Some(args.args[0] as PID)
            };
            sys_wait(&mut kernel.process_table, current_pid, child_pid)
        }
        SYS_GETPID => sys_getpid(current_pid),
        SYS_KILL => sys_kill(&mut kernel.process_table, current_pid, args.args[0] as PID),
        SYS_EXEC => sys_exec(kernel, current_pid, args.args[0] as u32),
        SYS_READ => {
            let fd = FileDescriptor(args.args[0] as u32);
            let count = args.args[1] as usize;
            let mut buf = vec![0u8; count.min(4096)];
            sys_read(kernel, current_pid, fd, &mut buf)
        }
        SYS_WRITE => {
            let fd = FileDescriptor(args.args[0] as u32);
            sys_write(kernel, current_pid, fd, b"Hello from kernel!")
        }
        SYS_OPEN => sys_open(kernel, current_pid, args.args[0] as u32),
        SYS_CLOSE => {
            let fd = FileDescriptor(args.args[0] as u32);
            sys_close(kernel, current_pid, fd)
        }
        SYS_SPAWN => {
            // For now, create a simple spawn without arguments
            sys_spawn(&mut kernel.process_table)
        }
        SYS_PS => sys_ps(&kernel.process_table),
        SYS_YIELD => sys_yield(),
        SYS_SLEEP => Ok(0),
        _ => Err(SyscallError::ENOSYS),
    }
}

pub fn sys_fork(pcb: &mut ProcessControlBlock, parent_pid: PID) -> SyscallResult<i32> {
    if parent_pid == 0 {
        match pcb.spawn() {
            Ok(new_pid) => Ok(new_pid as i32),
            Err(_) => Err(SyscallError::EAGAIN),
        }
    } else {
        match pcb.fork(parent_pid) {
            Ok(child_pid) => Ok(child_pid as i32),
            Err(_) => Err(SyscallError::EAGAIN),
        }
    }
}

pub fn sys_exit(pcb: &mut ProcessControlBlock, pid: PID, status: ExitStatus) -> SyscallResult<i32> {
    match pcb.exit(pid, status) {
        Ok(()) => Ok(0),
        Err(_) => Err(SyscallError::ESRCH),
    }
}

pub fn sys_wait(
    pcb: &mut ProcessControlBlock,
    parent_pid: PID,
    child_pid: Option<PID>,
) -> SyscallResult<i32> {
    match pcb.wait(parent_pid, child_pid) {
        Ok((waited_pid, _status)) => Ok(waited_pid as i32),
        Err(_) => Err(SyscallError::ECHILD),
    }
}

pub fn sys_kill(
    pcb: &mut ProcessControlBlock,
    _caller_pid: PID,
    target_pid: u32,
) -> SyscallResult<i32> {
    match pcb.send_signal(target_pid, 9) {
        Ok(()) => Ok(0),
        Err(_) => Err(SyscallError::ESRCH),
    }
}

pub fn sys_getpid(current_pid: PID) -> SyscallResult<i32> {
    Ok(current_pid as i32)
}

pub fn sys_read(
    kernel: &mut super::Kernel,
    current_pid: PID,
    fd: FileDescriptor,
    buf: &mut [u8],
) -> SyscallResult<i32> {
    if !fd.is_valid() {
        return Err(SyscallError::EBADF);
    }

    if fd == FileDescriptor::STDIN {
        return Ok(0);
    }
    let process = kernel
        .process_table
        .processes
        .get(&current_pid)
        .ok_or(SyscallError::ESRCH)?;

    if !process.fd_table.contains_key(&fd.0) {
        return Err(SyscallError::EBADF);
    }

    if let Some(open_file) = kernel.open_file_table.get_mut(&fd.0) {
        if !open_file.readable {
            return Err(SyscallError::EBADF);
        }
        if let Some(file) = kernel.filesystem.files.get(&open_file.filename) {
            let content_bytes = file.content.as_bytes();
            let bytes_available = content_bytes.len().saturating_sub(open_file.position);
            let bytes_to_read = std::cmp::min(buf.len(), bytes_available);

            if bytes_to_read > 0 {
                let end_pos = open_file.position + bytes_to_read;
                buf[..bytes_to_read].copy_from_slice(&content_bytes[open_file.position..end_pos]);
                open_file.position = end_pos;
            }

            Ok(bytes_to_read as i32)
        } else {
            Err(SyscallError::EBADF)
        }
    } else {
        Err(SyscallError::EBADF)
    }
}

pub fn sys_write(
    kernel: &mut super::Kernel,
    current_pid: PID,
    fd: FileDescriptor,
    buf: &[u8],
) -> SyscallResult<i32> {
    if !fd.is_valid() {
        return Err(SyscallError::EBADF);
    }

    if fd == FileDescriptor::STDOUT || fd == FileDescriptor::STDERR {
        return Ok(buf.len() as i32);
    }
    let process = kernel
        .process_table
        .processes
        .get(&current_pid)
        .ok_or(SyscallError::ESRCH)?;

    if !process.fd_table.contains_key(&fd.0) {
        return Err(SyscallError::EBADF);
    }

    if let Some(open_file) = kernel.open_file_table.get(&fd.0) {
        if !open_file.writable {
            return Err(SyscallError::EBADF);
        }
        if let Some(file) = kernel.filesystem.files.get_mut(&open_file.filename) {
            let new_content = String::from_utf8_lossy(buf).to_string();
            file.content.push_str(&new_content);

            Ok(buf.len() as i32)
        } else {
            Err(SyscallError::EBADF)
        }
    } else {
        Err(SyscallError::EBADF)
    }
}

pub fn sys_open(
    kernel: &mut super::Kernel,
    current_pid: PID,
    _path_len: u32,
) -> SyscallResult<i32> {
    let filename = "test.txt".to_string();
    if !kernel.filesystem.files.contains_key(&filename) {
        return Err(SyscallError::EBADF);
    }
    let process = kernel
        .process_table
        .processes
        .get_mut(&current_pid)
        .ok_or(SyscallError::ESRCH)?;

    let global_fd = kernel.next_global_fd;
    kernel.next_global_fd += 1;
    let open_file = super::OpenFile {
        filename: filename.clone(),
        position: 0,
        readable: true,
        writable: true,
    };

    kernel.open_file_table.insert(global_fd, open_file);
    let fd = FileDescriptor(global_fd);
    process.fd_table.insert(global_fd, fd);

    Ok(global_fd as i32)
}

pub fn sys_close(
    kernel: &mut super::Kernel,
    current_pid: PID,
    fd: FileDescriptor,
) -> SyscallResult<i32> {
    if fd == FileDescriptor::STDIN || fd == FileDescriptor::STDOUT || fd == FileDescriptor::STDERR {
        return Err(SyscallError::EBADF);
    }
    let process = kernel
        .process_table
        .processes
        .get_mut(&current_pid)
        .ok_or(SyscallError::ESRCH)?;

    if process.fd_table.remove(&fd.0).is_some() {
        kernel.open_file_table.remove(&fd.0);
        Ok(0)
    } else {
        Err(SyscallError::EBADF)
    }
}

pub fn sys_exec(
    kernel: &mut super::Kernel,
    current_pid: PID,
    _path_len: u32,
) -> SyscallResult<i32> {
    let program_name = "program.exe".to_string();

    if !kernel.filesystem.files.contains_key(&program_name) {
        return Err(SyscallError::EBADF);
    }

    match kernel.process_table.exec(current_pid, program_name) {
        Ok(()) => Ok(0),
        Err(_) => Err(SyscallError::ESRCH),
    }
}

pub fn sys_spawn(pcb: &mut ProcessControlBlock) -> SyscallResult<i32> {
    match pcb.spawn() {
        Ok(pid) => Ok(pid as i32),
        Err(_) => Err(SyscallError::EAGAIN),
    }
}

pub fn sys_ps(pcb: &ProcessControlBlock) -> SyscallResult<i32> {
    // Return number of processes for now
    Ok(pcb.processes.len() as i32)
}

pub fn sys_yield() -> SyscallResult<i32> {
    // Cooperative yield - in WASM this is essentially a no-op
    Ok(0)
}
