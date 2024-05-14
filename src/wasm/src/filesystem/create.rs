

// use std::cell::RefCell;
// use std::rc::Rc;
use std::path::Path;
use once_cell::sync::Lazy;
use std::sync::{Arc, Mutex};

use crate::filesystem::node::Node;
use crate::filesystem::node::NodeType;

use web_sys::console;

static ROOT_NODE: Lazy<Arc<Mutex<Node>>> = Lazy::new(|| {
    return create_fs(&Path::new("../../assets/fs"));
});

pub fn get_root_node() -> Arc<Mutex<Node>> {
    ROOT_NODE.clone()
}

fn traverse(path: &Path, node: Arc<Mutex<Node>>) {

  console::log_1(&path.display().to_string().into());

  let children = match path.read_dir() {
      Ok(children) => {
          console::log_1(&"children".into());
          children
      },
      Err(_) => {
          console::log_1(&"error".into());
          return;
      
      },
  };

  for child in children.filter_map(|e| e.ok()) {
      let child_path = child.path();
      let child_name = child_path.file_name().unwrap().to_str().unwrap().to_string();
      let child_node;
      if child_path.is_dir() {
          console::log_1(&"directory".into());
          child_node = Arc::new(Mutex::new(Node::new(child_name, NodeType::Directory, Some(node.clone()))));
          traverse(&child_path, Arc::clone(&child_node));
      } else if child_path.is_file() {
          console::log_1(&"file".into());
          child_node = Arc::new(Mutex::new(Node::new(child_name, NodeType::File, Some(node.clone()))));
      } else {
          continue;
      }

      match node.lock().unwrap().get_node_type() {
          NodeType::File => continue,
          NodeType::Directory => {
              node.lock().unwrap().add_child(Arc::clone(&child_node));
          }
      }
  }
}

fn create_fs (root_path: &Path) -> Arc<Mutex<Node>> {
  let root = Arc::new(Mutex::new(Node::new("root".to_string(), NodeType::Directory, None)));
    // read files in root_path and create a filesystem structure, traverse directories
    traverse(root_path, Arc::clone(&root));
  root
}