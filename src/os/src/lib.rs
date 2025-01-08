#![allow(unused)]

mod kernel;
mod user;

use kernel::Kernel;
use user::{Shell, WindowManager};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct OS {
    kernel: Kernel,
    shell: Shell,
    window_manager: WindowManager,
}

#[wasm_bindgen]
impl OS {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            kernel: Kernel::new(),
            shell: Shell::new(),
            window_manager: WindowManager::new(),
        }
    }

    pub fn tick(&mut self) {
        self.kernel.tick();
    }
}
