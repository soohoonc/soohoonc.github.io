// Public interface for user-space programs to interact with kernel
// Similar to Linux's uapi or xv6's user.h

#[derive(Debug)]
pub struct FileDescriptor(pub u32);

impl FileDescriptor {
    pub const STDIN: FileDescriptor = FileDescriptor(0);
    pub const STDOUT: FileDescriptor = FileDescriptor(1);
    pub const STDERR: FileDescriptor = FileDescriptor(2);
}

// Public syscall interface
pub fn write(fd: FileDescriptor, buf: &[u8]) -> Result<usize, String> {
    unsafe { syscall(SYS_WRITE, fd.0 as usize, buf.as_ptr() as usize, buf.len()) }
}

pub fn fork() -> Result<u32, String> {
    unsafe { syscall(SYS_FORK, 0, 0, 0) }.map(|pid| pid as u32)
}

pub fn exit(status: i32) -> ! {
    unsafe {
        syscall(SYS_EXIT, status as usize, 0, 0).unwrap();
    }
    unreachable!()
}

// Private implementation details
const SYS_FORK: usize = 1;
const SYS_EXIT: usize = 2;
const SYS_WRITE: usize = 3;

unsafe fn syscall(num: usize, arg1: usize, arg2: usize, arg3: usize) -> Result<usize, String> {
    super::trap::do_syscall(num, arg1, arg2, arg3)
}
