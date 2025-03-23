#![allow(unused)]

mod kernel;
mod user;

use kernel::Kernel;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct OS {
    kernel: Kernel,
}

#[wasm_bindgen]
impl OS {
    pub fn new() -> Self {
        let mut kernel = Kernel::new();
        kernel.kinit();
        kernel.userinit();

        Self { kernel }
    }
}
