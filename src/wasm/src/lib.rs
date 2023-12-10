use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct File {
    name: String,
    size: u32,
}

#[wasm_bindgen]
pub struct FileSystem {
    files: Vec<File>,
}

#[wasm_bindgen]
impl FileSystem {
    pub fn new() -> FileSystem {
        FileSystem { files: Vec::new() }
    }

    pub fn add_file(&mut self, name: String, size: u32) {
        self.files.push(File { name, size });
    }

    pub fn get_files(&self) -> String {
        let mut result = String::new();
        for file in &self.files {
            result.push_str(&format!("{}: {}\n", file.name, file.size));
        }
        result
    }
}