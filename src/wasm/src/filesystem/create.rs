use std::cell::RefCell;
use std::rc::Rc;
use std::path::Path;

use crate::filesystem::node::Node;
use crate::filesystem::node::NodeType;

use web_sys::console;

fn traverse(path: &Path, node: Rc<RefCell<Node>>) {
  // read files in path and create a filesystem structure
  console::log_1(&path.display().to_string().into());
  let children = match path.read_dir() {
    Ok(children) => {
      console::log_1(&"children".into());
      children
    },
    Err(_) => return,
  };
  for child in children {
    let child = match child {
      Ok(child) => child,
      Err(_) => continue,
    };
    let child_path = child.path();
    let child_name = child_path.file_name().unwrap().to_str().unwrap().to_string();
    let child_node;
    if child_path.is_dir() {
      child_node = Rc::new(RefCell::new(Node::new(child_name, NodeType::Directory, Some(node.clone()))));
      traverse(&child_path, Rc::clone(&child_node));
    } else if child_path.is_file() {
      child_node = Rc::new(RefCell::new(Node::new(child_name, NodeType::File, Some(node.clone()))));
    } else {
      continue;
    }
    match node.borrow().get_node_type() {
      NodeType::File => continue,
      NodeType::Directory => {
        node.borrow_mut().add_child(Rc::clone(&child_node));
      }
    }
  }
}

pub fn create_fs (root_path: &Path) -> Rc<RefCell<Node>> {
  let root = Rc::new(RefCell::new(Node::new("root".to_string(), NodeType::Directory, None)));
  // read files in root_path and create a filesystem structure, traverse directories
  traverse(root_path, Rc::clone(&root));
  root
}