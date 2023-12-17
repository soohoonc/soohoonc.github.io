use crate::FileSystemNode;
use crate::FileSystemNodeTrait;

pub struct Directory {
    name: String,
    parent: Option<Box<Directory>>,
    children: Vec<FileSystemNode>,
}

impl Directory {
    pub fn new(name: String, parent: Option<Box<Directory>>) -> Directory {
        Directory {
            name,
            parent,
            children: Vec::<FileSystemNode>::new()
        }
    }

    pub fn get_name(&self) -> &String {
        &self.name
    }

    pub fn parent_name(&self) -> Option<&String> {
        match &self.parent {
            Some(parent) => Some(&parent.name),
            None => None,
        }
    }

    pub fn add_child(&mut self, child: FileSystemNode) {
        self.children.push(child);
    }

    pub fn get_child(&self, name: &String) -> Option<&FileSystemNode> {
        for child in &self.children {
            if &child.get_name() == &name {
                return Some(child);
            }
        }
        None
    }

    pub fn remove_child(&mut self, name: &String) -> Option<FileSystemNode> {
        for i in 0..self.children.len() {
            if &self.children[i].get_name() == &name {
                return Some(self.children.remove(i));
            }
        }
        None
    }
}