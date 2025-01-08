#![allow(unused)]

mod kernel;
mod user;

use kernel::{process::ProcessID, syscall::SystemCall, Kernel, SystemCallResult};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct OS {
    kernel: Kernel,
    init_process: ProcessID,
}

#[wasm_bindgen]
impl OS {
    pub fn new() -> Self {
        let mut kernel = Kernel::new();

        // Start init process (PID 1)
        let init_pid = kernel
            .handle_syscall(SystemCall::CreateProcess {
                name: "init".into(),
            })
            .unwrap_pid();

        // Init starts core system processes
        kernel.handle_syscall(SystemCall::CreateProcess {
            name: "window_manager".into(),
            parent: init_pid,
        });

        kernel.handle_syscall(SystemCall::CreateProcess {
            name: "shell".into(),
            parent: init_pid,
        });

        Self {
            kernel,
            init_process: init_pid,
        }
    }

    pub fn tick(&mut self) {
        self.kernel.tick();
    }

    // Only expose syscall interface to JavaScript
    pub fn syscall(&mut self, call: JsValue) -> Result<JsValue, JsValue> {
        let syscall: SystemCall = serde_wasm_bindgen::from_value(call)?;
        let result = self.kernel.handle_syscall(syscall);
        Ok(serde_wasm_bindgen::to_value(&result)?)
    }
}
