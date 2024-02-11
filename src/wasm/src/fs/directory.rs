use std::cell::RefCell;
use std::rc::Rc;

use crate::FileSystemNode;

pub struct Directory {
    name: String,
    parent: Option<Rc<RefCell<Directory>>>,
    children: Vec<Rc<RefCell<FileSystemNode>>>,
}

impl Directory {
    pub fn new(name: String, parent: Option<Rc<RefCell<Directory>>>) -> Directory {
        Directory {
            name,
            parent,
            children: Vec::<Rc<RefCell<FileSystemNode>>>::new(),
        }
    }

    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    pub fn parent_name(&self) -> Option<String> {
        match &self.parent {
            Some(parent) => Some(parent.borrow().get_name()),
            None => None,
        }
    }

    pub fn get_parent(&self) -> Option<Rc<RefCell<Directory>>> {
        match &self.parent {
            Some(parent) => Some(Rc::clone(parent)),
            None => None,
        }
    }

    pub fn get_children(&self) -> Vec<Rc<RefCell<FileSystemNode>>> {
        self.children.clone()
    }

    pub fn add_child(&mut self, child: Rc<RefCell<FileSystemNode>>) {
        self.children.push(Rc::clone(&child));
    }
}