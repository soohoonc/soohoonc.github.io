use wasm_bindgen::prelude::*;

mod directory;
mod file;

use directory::Directory;
use file::File;

pub trait FileSystemNodeTrait {
    fn get_name(&self) -> &String;
    fn parent_name(&self) -> Option<&String>;
}

pub enum FileSystemNode {
    File(File),
    Directory(Directory),
}

impl FileSystemNodeTrait for FileSystemNode {
    fn get_name(&self) -> &String {
        match self {
            FileSystemNode::File(file) => &file.get_name(),
            FileSystemNode::Directory(directory) => &directory.get_name(),
        }
    }

    fn parent_name(&self) -> Option<&String> {
        match self {
            FileSystemNode::File(file) => Some(file.parent_name()),
            FileSystemNode::Directory(directory) => directory.parent_name(),
        }
    }
}

#[wasm_bindgen]
pub struct FileSystem {
    root: Directory,
}

#[wasm_bindgen]
impl FileSystem {
    #[wasm_bindgen(constructor)]
    pub fn new() -> FileSystem {
        let root = Directory::new("root".to_string(), None);
        // let user = Directory::new("user".to_string(), Some(Box::new(root)));
        // let guest = Directory::new("guest".to_string(), Some(Box::new(user)));
        FileSystem {
            root,
            // current: root,
        }
    }

    #[wasm_bindgen]
    pub fn hello(&self) -> JsValue {
       JsValue::from_str("Hello, World!")
    }

    // // Method to change the current directory
    // pub fn change_dir(&mut self, new_path: &str) {
        
    // }
}

// #[wasm_bindgen]
// impl Directory {
//     pub fn create(name: &str) {
        
//     }

//     pub fn delete() {

//     }

//     pub fn update(name: &str) {

//     }
// }

// #[wasm_bindgen]
// impl File {
//     pub fn create_file(name: &str, permission: u8, data: &str) {
        
//     }

//     pub fn read_file() -> String {
//         "Hello, World!".to_string()
//     }

//     pub fn write_file(data: &str) {
        
//     }

//     pub fn delete_file() {
        
//     }
// }