use std::rc::Rc;
use std::cell::RefCell;

use super::directory::Directory;
use super::file::File;
// use std::sync::{Arc, Mutex};

#[derive(Clone, PartialEq)]
pub enum NodeType {
    Directory(Directory),
    File(File),
}

#[derive(Clone, PartialEq)]
pub struct Node {
    name: String,
    node_type: NodeType,
    parent: Option<Rc<RefCell<Node>>>,
    children: Vec<Rc<RefCell<Node>>>,
}

impl Node {
    pub fn new(name: String, node_type: NodeType, parent: Option<Rc<RefCell<Node>>>) -> Node {
        Node {
            name,
            node_type,
            parent,
            children: Vec::new(),
        }
    }

    pub fn as_directory(&self) -> Option<&Directory> {
        if let NodeType::Directory(ref dir) = self.node_type {
            Some(dir)
        } else {
            None
        }
    }

    // pub fn as_file(&self) -> Option<&File> {
    //     if let NodeType::File(ref file) = self.node_type {
    //         Some(file)
    //     } else {
    //         None
    //     }
    // }

    pub fn get_node_type(&self) -> NodeType {
        self.node_type.clone()
    }

    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    pub fn get_parent(&self) -> Option<Rc<RefCell<Node>>> {
        match &self.parent {
            Some(parent) => Some(Rc::clone(parent)),
            None => None,
        }
    }

    pub fn get_children(&self) -> Vec<Rc<RefCell<Node>>> {
        self.children.clone()
    }

    pub fn add_child(&mut self, child: Rc<RefCell<Node>>) {
        self.children.push(Rc::clone(&child));
    }
}