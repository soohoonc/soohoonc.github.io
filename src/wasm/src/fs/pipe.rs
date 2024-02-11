use wasm_bindgen::prelude::*;
use crate::FileSystemNode;

#[wasm_bindgen]
pub struct Pipe {
    name: String,
    data: String,
}

#[wasm_bindgen]
impl Pipe {
    pub fn new(name: &str, data: &str) -> Pipe {
        Pipe {
            name: name.to_string(),
            data: data.to_string()
        }
    }
}
