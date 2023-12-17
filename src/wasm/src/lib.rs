use std::rc::Rc;
use std::cell::RefCell;
use std::result::Result;

use wasm_bindgen::prelude::*;
use serde_json;
use web_sys::console;


mod directory;
mod file;

use directory::Directory;
use file::File;

pub trait FileSystemNodeTrait {
    fn get_name(&self) -> String;
    fn parent_name(&self) -> Option<String>;
}

pub enum FileSystemNode {
    File(Rc<RefCell<File>>),
    Directory(Rc<RefCell<Directory>>),
}

impl FileSystemNodeTrait for FileSystemNode {
    fn get_name(&self) -> String {
        match self {
            FileSystemNode::File(file) => file.borrow().get_name().clone(),
            FileSystemNode::Directory(directory) => directory.borrow().get_name().clone()
        }
    }

    fn parent_name(&self) -> Option<String> {
        match self {
            FileSystemNode::File(file) => Some(file.borrow().parent_name().clone()),
            FileSystemNode::Directory(directory) => directory.borrow().parent_name().clone(),
        }
    }
}

#[wasm_bindgen]
pub struct FileSystem {
    root: Rc<RefCell<Directory>>,
    current: Rc<RefCell::<Directory>>,
}

#[wasm_bindgen]
impl FileSystem {
    #[wasm_bindgen(constructor)]
    pub fn new() -> FileSystem {
        let root = Rc::new(RefCell::new(Directory::new("".to_string(), None)));
        let users = Rc::new(RefCell::new(Directory::new("users".to_string(), Some(Rc::clone(&root)))));
        let users_node = FileSystemNode::Directory(Rc::clone(&users));
        root.borrow_mut().add_child(Rc::new(RefCell::new(users_node)));
        let guest = Rc::new(RefCell::new(Directory::new("guest".to_string(), Some(Rc::clone(&users)))));
        let guest_node = FileSystemNode::Directory(Rc::clone(&guest));
        users.borrow_mut().add_child(Rc::new(RefCell::new(guest_node)));
        FileSystem {
            root: Rc::clone(&root),
            current: Rc::clone(&guest),
        }
    }

    pub fn hello(&self) -> JsValue {
       JsValue::from_str("Hello from WASM!")
    }

    pub fn get_current(&self) -> String {
        // build path from root to current
        let mut path = Vec::<String>::new();
        let mut temp_dir = Rc::clone(&self.current);
        loop {
            path.push(temp_dir.borrow().get_name());
            let temp_parent = temp_dir.borrow().get_parent();
            match temp_parent {
                Some(parent) => temp_dir = Rc::clone(&parent),
                None => break,
            }
        }
        path.reverse();
        let mut path_string = String::new();
        for path_part in path {
            path_string.push_str(path_part.as_str());
            path_string.push_str("/");
        }
        path_string.pop();
        serde_json::to_string(&path_string).unwrap()
    }

    // Method to change the current directory
    pub fn change_dir(&mut self, new_path: &str) -> Result<(), JsValue> {
        // find the directory
        // if it exists, change the current directory
        // else, return an error
        // console::log_1(&JsValue::from_str(new_path));
        let mut temp_dir = if new_path.starts_with("/") {
            Rc::clone(&self.root)
        } else {
            Rc::clone(&self.current)
        };
        for path in new_path.split("/").filter(|&x| !x.is_empty()) {
            // console::log_1(&JsValue::from_str(path));
            if path == "." {
                // console::log_1(&JsValue::from_str("Continuing"));
                continue;
            } else if path == ".." {
                // console::log_1(&JsValue::from_str("Going up"));
                let temp_parent = temp_dir.borrow().get_parent();
                match temp_parent {
                    Some(parent) => temp_dir = Rc::clone(&parent),
                    None => temp_dir = Rc::clone(&temp_dir),
                }
            } else {
                let mut found = false;
                // console::log_1(&JsValue::from_str("Searching"));
                let children = temp_dir.borrow().get_children();
                for child in children {
                    // console::log_1(&JsValue::from_str(child.borrow().get_name().as_str()));
                    let child_node = child.borrow();
                    // console::log_2(&JsValue::from_str(&child_node.get_name()), &JsValue::from_str(path));
                    if child_node.get_name() == path {
                        match &*child_node {
                            FileSystemNode::Directory(child_dir) => {
                                temp_dir = Rc::clone(child_dir);
                                found = true;
                                break;
                            },
                            FileSystemNode::File(_) => {
                                return Err(JsValue::from_str("Not a directory"))
                            }
                        }
                    }
                }
                if !found {
                    return Err(JsValue::from_str("Directory not found"));
                }
            }
        }
        self.current = temp_dir;
        Ok(())
    }
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