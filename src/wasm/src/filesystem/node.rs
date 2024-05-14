// use std::rc::Rc;
// use std::cell::RefCell;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub enum NodeType {
    Directory,
    File,
}

#[derive(Clone)]
pub struct Node {
    name: String,
    node_type: NodeType,
    parent: Option<Arc<Mutex<Node>>>,
    children: Vec<Arc<Mutex<Node>>>,
}

impl Node {
    pub fn new(name: String, node_type: NodeType, parent: Option<Arc<Mutex<Node>>>) -> Node {
        Node {
            name,
            node_type,
            parent,
            children: Vec::<Arc<Mutex<Node>>>::new(),
        }
    }

    pub fn get_node_type(&self) -> NodeType {
        self.node_type.clone()
    }

    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    pub fn get_parent(&self) -> Option<Arc<Mutex<Node>>> {
        match &self.parent {
            Some(parent) => Some(Arc::clone(parent)),
            None => None,
        }
    }

    pub fn add_child(&mut self, child: Arc<Mutex<Node>>) {
        self.children.push(child);
    }

    pub fn get_children(&self) -> Vec<Arc<Mutex<Node>>> {
        self.children.clone()
    }
}