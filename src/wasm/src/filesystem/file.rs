// use std::{cell::RefCell, rc::Rc};
use std::sync::{Arc, Mutex};

use crate::filesystem::node::Node;


pub struct File {
    name: String,
    data: String,
    node: Arc<Mutex<Node>>
}

impl File {
    pub fn new(name: String, data: String, node: Arc<Mutex<Node>>) -> File {
        File {
            name,
            data,
            node,
        }
    }

    pub fn get_name(&self) -> &String {
        &self.name
    }

    pub fn read(&self) -> String {
        self.data.clone()
    }
    pub fn write(&mut self, data: String) {
        self.data = data;
    }
}
