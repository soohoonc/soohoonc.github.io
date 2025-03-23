// user-space api for interacting with kernel

use crate::kernel::{process, scheduler};

// Public interface for user programs
#[derive(Debug)]
pub struct FileDescriptor(pub u32);

impl FileDescriptor {
    pub const STDIN: FileDescriptor = FileDescriptor(0);
    pub const STDOUT: FileDescriptor = FileDescriptor(1);
    pub const STDERR: FileDescriptor = FileDescriptor(2);
}
