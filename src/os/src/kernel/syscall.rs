use super::{
    fs::FileSystem,
    proc::{PTable, Pid},
    Kernel,
};

pub const SYS_READ: u64 = 1;
pub const SYS_WRITE: u64 = 2;
pub const SYS_CREATE: u64 = 3;
pub const SYS_MKDIR: u64 = 4;
pub const SYS_LS: u64 = 5;
pub const SYS_SPAWN: u64 = 6;
pub const SYS_KILL: u64 = 7;
pub const SYS_PS: u64 = 8;
pub const SYS_GETPID: u64 = 9;

pub const EPERM: u64 = 1; // Operation not permitted
pub const ENOENT: u64 = 2; // No such file or directory
pub const ESRCH: u64 = 3; // No such process
pub const EBADF: u64 = 9; // Bad file descriptor
pub const EACCES: u64 = 13; // Permission denied
pub const EFAULT: u64 = 14; // Bad address
pub const EEXIST: u64 = 17; // File exists
pub const ENOTDIR: u64 = 20; // Not a directory
pub const ENOSYS: u64 = 38; // Function not implemented

fn errno(code: u64) -> u64 {
    (!code).wrapping_add(1)
}

unsafe fn ptr_to_string(ptr: *const u8) -> Option<String> {
    if ptr.is_null() {
        return None;
    }

    let mut len = 0;
    while *ptr.add(len) != 0 {
        len += 1;
        if len > 256 {
            return None;
        }
    }

    let slice = std::slice::from_raw_parts(ptr, len);
    String::from_utf8(slice.to_vec()).ok()
}

pub fn syscall_dispatch(kernel: &mut Kernel, pid: Pid, syscall_num: u64, args: [u64; 6]) -> u64 {
    match syscall_num {
        SYS_READ => sys_read(
            &mut kernel.fs,
            &mut kernel.ptable,
            pid,
            args[0] as u32,
            args[1] as *mut u8,
            args[2] as usize,
        ),
        SYS_WRITE => sys_write(
            &mut kernel.fs,
            &mut kernel.ptable,
            pid,
            args[0] as u32,
            args[1] as *const u8,
            args[2] as usize,
        ),
        SYS_CREATE => sys_create(&mut kernel.fs, args[0] as *const u8, args[1] as *const u8),
        SYS_MKDIR => sys_mkdir(&mut kernel.fs, args[0] as *const u8),
        SYS_LS => sys_ls(&mut kernel.fs, args[0] as *const u8),
        SYS_SPAWN => sys_spawn(&mut kernel.ptable, args[0] as *const u8),
        SYS_KILL => sys_kill(&mut kernel.ptable, args[0] as u32),
        SYS_PS => sys_ps(&kernel.ptable),
        SYS_GETPID => sys_getpid(pid),
        _ => errno(ENOSYS),
    }
}

pub fn sys_read(
    fs: &mut FileSystem,
    ptable: &mut PTable,
    pid: Pid,
    fd: u32,
    buf: *mut u8,
    count: usize,
) -> u64 {
    if fd == 0 {
        return 0;
    }

    let proc = match ptable.get(pid) {
        Some(p) => p,
        None => return errno(ESRCH),
    };

    if proc.pid != pid {
        return errno(ESRCH);
    }

    if fd as usize >= proc.fds.len() {
        return errno(EBADF);
    }

    if buf.is_null() {
        return errno(EFAULT);
    }

    let path = &proc.fds[fd as usize];
    if let Some(data) = fs.read(path) {
        let bytes_to_read = count.min(data.len());
        unsafe {
            std::ptr::copy_nonoverlapping(data.as_ptr(), buf, bytes_to_read);
        }
        bytes_to_read as u64
    } else {
        errno(ENOENT)
    }
}

pub fn sys_write(
    fs: &mut FileSystem,
    ptable: &mut PTable,
    pid: Pid,
    fd: u32,
    buf: *const u8,
    count: usize,
) -> u64 {
    if fd == 1 || fd == 2 {
        return count as u64;
    }

    let proc = match ptable.get(pid) {
        Some(p) => p,
        None => return errno(ESRCH),
    };

    if proc.pid != pid {
        return errno(ESRCH);
    }

    if fd as usize >= proc.fds.len() {
        return errno(EBADF);
    }

    if buf.is_null() {
        return errno(EFAULT);
    }

    let path = &proc.fds[fd as usize];
    let data = unsafe { std::slice::from_raw_parts(buf, count).to_vec() };

    if fs.write(path, data) {
        count as u64
    } else {
        errno(EACCES)
    }
}

pub fn sys_create(fs: &mut FileSystem, path_ptr: *const u8, content_ptr: *const u8) -> u64 {
    let path = match unsafe { ptr_to_string(path_ptr) } {
        Some(p) => p,
        None => return errno(EFAULT),
    };

    let content = match unsafe { ptr_to_string(content_ptr) } {
        Some(c) => c.into_bytes(),
        None => b"New file".to_vec(),
    };

    if fs.create(&path, content) {
        0
    } else {
        errno(EEXIST)
    }
}

pub fn sys_mkdir(fs: &mut FileSystem, path_ptr: *const u8) -> u64 {
    let path = match unsafe { ptr_to_string(path_ptr) } {
        Some(p) => p,
        None => return errno(EFAULT),
    };

    if fs.mkdir(&path) {
        0
    } else {
        errno(EEXIST)
    }
}

pub fn sys_ls(fs: &mut FileSystem, path_ptr: *const u8) -> u64 {
    let path = match unsafe { ptr_to_string(path_ptr) } {
        Some(p) => p,
        None => "/".to_string(),
    };

    if let Some(entries) = fs.ls(&path) {
        entries.len() as u64
    } else {
        errno(ENOTDIR)
    }
}

pub fn sys_spawn(ptable: &mut PTable, name_ptr: *const u8) -> u64 {
    let name = match unsafe { ptr_to_string(name_ptr) } {
        Some(n) => n,
        None => return errno(EFAULT),
    };

    ptable.spawn(name) as u64
}

pub fn sys_kill(ptable: &mut PTable, pid: u32) -> u64 {
    if pid == 1 {
        return errno(EPERM);
    }

    if ptable.kill(pid) {
        0
    } else {
        errno(ESRCH)
    }
}

pub fn sys_ps(ptable: &PTable) -> u64 {
    ptable.ps().len() as u64
}

pub fn sys_getpid(pid: Pid) -> u64 {
    pid as u64
}
