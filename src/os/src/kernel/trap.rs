pub enum SystemCall {
    CreateProcess { name: String },
    KillProcess { pid: ProcessID },
    ReadFile { path: String },
    WriteFile { path: String, content: Vec<u8> },
    CreateWindow { title: String },
    Exit,
}

pub enum SystemCallResult {
    Ok(usize),
    Error(String),
}

impl Kernel {
    pub fn syscall(&mut self, syscall: SystemCall) -> SystemCallResult {
        match syscall {
            SystemCall::CreateProcess { name } => {
                let pid = self.process_manager.create_process(&name);
                SystemCallResult::Ok(pid as usize)
            }
            SystemCall::KillProcess { pid } => match self.process_manager.kill_process(pid) {
                Ok(()) => SystemCallResult::Ok(0),
                Err(e) => SystemCallResult::Error(e.to_string()),
            },
            // ... other syscall handlers
        }
    }
}

/**
 * Why Traps?
 * 
 * When trying to virtualize the CPU, we want to balance between efficiently handling the hardware
 * while still being able to control the system. 
 * 
 * The naive approach is to run directly on the CPU/hardware.
 * OS prepares process, allocates memory, etc. and then runs the main() of the program until it returns and cleans up.
 * There are two problems with this:
 * 1. How can a process perform I/O and 'restricted' operations safely?
 * One solution is to introduce modes, like kernel mode and user mode for accessing different resources.
 * With this we still have the problem on how do user programs perform I/O and 'restricted' operations (kernel mode operations)?
 * We allow user programs to perform system calls. User programs can trap into the kernel and return-from-trap back to the user program.
 * The OS keeps track of a trap table (created at boot time) that maps a trap number to a handler function (for syscalls, timers). 
 * 
 * 2. When the process is running, how can the OS interrupt it to run other processes (time sharing)?
 * When a process is running, then by definition the OS is not running, how can it regain control to switch to another process?
 * Cooperative multitasking: the OS can switch to another process when the current process yields (yield syscall) control, trusts the process lol.
 * But how can the OS regain control is the process is not being cooperative?
 * Timer interrupt: forced interrupt at fixed intervals.
 * Once the OS gains control, it can choose to continue or switch, determined by the scheduler.
 * Context switch!
 */