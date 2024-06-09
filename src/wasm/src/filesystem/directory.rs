use std::cell::RefCell;
use std::rc::Rc;
// use std::sync::{Arc, Mutex};
use crate::filesystem::node::Node;

#[derive(Clone, PartialEq)]
pub struct Directory {
    pub name: String,
    children: Vec<Rc<RefCell<Node>>>,
}

impl Directory {
    pub fn new(name: String, children: Vec<Rc<RefCell<Node>>>) -> Directory {
        Directory {
            name,
            children
        }
    }
}