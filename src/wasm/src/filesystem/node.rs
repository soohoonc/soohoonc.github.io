use std::rc::Rc;
use std::cell::RefCell;

#[derive(Clone)]
pub enum NodeType {
    Directory,
    File,
}


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
            children: Vec::<Rc<RefCell<Node>>>::new(),
        }
    }

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

    pub fn add_child(&mut self, child: Rc<RefCell<Node>>) {
        self.children.push(child);
    }

    pub fn get_children(&self) -> Vec<Rc<RefCell<Node>>> {
        self.children.clone()
    }
}