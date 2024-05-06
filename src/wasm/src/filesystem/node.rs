use std::rc::Rc;
use std::cell::RefCell;


pub enum NodeType {
    Directory,
    File,
}

pub struct Node {
    name: String,
    node_type: NodeType,
    parent: Option<Rc<RefCell<Node>>>,
}