
use std::rc::Rc;
use std::cell::RefCell;
use wasm_bindgen::prelude::*;
use web_sys::console;

use crate::filesystem::node::Node;
use crate::filesystem::directory::Directory;
use crate::shell::lexer::Statement;

pub struct Exec {
    root: Rc<RefCell<Directory>>,
    current: Rc<RefCell<Directory>>,
}

impl Exec {
  pub fn new(root: Rc<RefCell<Directory>>, current: Rc<RefCell<Directory>>) -> Exec {
      Exec {
        root,
        current,
      }
  }

  fn hello() -> String {
    "Hello from WASM!".to_string()
  }

  fn ls(&mut self, options: Vec<String>) -> String {
    let mut children = Vec::<String>::new();
    // for child in self.current.borrow().get_children() {
    //     children.push(child.borrow().get_name());
    // }
    serde_json::to_string(&children).unwrap()
  }

  fn pwd() -> String {
    // build path from root to current
    // let mut path = Vec::<String>::new();
    // let mut temp_dir = Rc::clone(&self.current);
    // loop {
    //     path.push(temp_dir.borrow().get_name());
    //     let temp_parent = temp_dir.borrow().get_parent();
    //     match temp_parent {
    //         Some(parent) => temp_dir = Rc::clone(&parent),
    //         None => break,
    //     }
    // }
    // path.reverse();
    // let mut path_string = String::new();
    // for path_part in path {
    //     path_string.push_str(path_part.as_str());
    //     path_string.push_str("/");
    // }
    // path_string.pop();
    // serde_json::to_string(&path_string).unwrap()
    "pwd command".to_string()
  }

  fn cd(new_path: String) -> String {
    console::log_1(&JsValue::from_str(&new_path));
    // find the directory
    // if it exists, change the current directory
    // else, return an error
    // console::log_1(&JsValue::from_str(new_path));
    // let mut temp_dir = if new_path.starts_with("/") {
    //     Rc::clone(&self.root)
    // } else {
    //     Rc::clone(&self.current)
    // };
    // for path in new_path.split("/").filter(|&x| !x.is_empty()) {
    //     // console::log_1(&JsValue::from_str(path));
    //     if path == "." {
    //         // console::log_1(&JsValue::from_str("Continuing"));
    //         continue;
    //     } else if path == ".." {
    //         // console::log_1(&JsValue::from_str("Going up"));
    //         let temp_parent = temp_dir.borrow().get_parent();
    //         match temp_parent {
    //             Some(parent) => temp_dir = Rc::clone(&parent),
    //             None => temp_dir = Rc::clone(&temp_dir),
    //         }
    //     } else {
    //         let mut found = false;
    //         // console::log_1(&JsValue::from_str("Searching"));
    //         let children = temp_dir.borrow().get_children();
    //         for child in children {
    //             // console::log_1(&JsValue::from_str(child.borrow().get_name().as_str()));
    //             let child_node = child.borrow();
    //             // console::log_2(&JsValue::from_str(&child_node.get_name()), &JsValue::from_str(path));
    //             if child_node.get_name() == path {
    //                 match &*child_node {
    //                     Node::Directory(child_dir) => {
    //                         temp_dir = Rc::clone(child_dir);
    //                         found = true;
    //                         break;
    //                     },
    //                     Node::File(_) => {
    //                         return Err(JsValue::from_str("Not a directory"))
    //                     }
    //                 }
    //             }
    //         }
    //         if !found {
    //             return Err(JsValue::from_str("Directory not found"));
    //         }
    //     }
    // }
    // self.current = temp_dir;
    // Ok(JsValue::from_str("Success"))
    "cd command".to_string()
  }

    pub fn execute(&mut self, input: Statement) -> String {
        match &input.command[..] {
          "hello" => Self::hello(),
          "ls" => Self::ls(self, input.options),
          "pwd" => Self::pwd(),
          "cd" => Self::cd("".into()),
          "whoami" => "root".to_owned(),
          "exit" => "Goodbye!".to_owned(),
          "clear" => "".to_owned(),
          "echo" => "echo command".to_owned(),
          "cat" => "cat command".to_owned(),
          "touch" => "touch command".to_owned(),
          "mkdir" => "mkdir command".to_owned(),
          "rm" => "rm command".to_owned(),
          "rmdir" => "rmdir command".to_owned(),
          "mv" => "mv command".to_owned(),
          "cp" => "cp command".to_owned(),
          "help" => "help command".to_owned(),
          "license" => "license command".to_owned(),
          "alias" => "alias command".to_owned(),
          "env" => "env command".to_owned(),
          "grep" => "grep command".to_owned(),
          "find" => "find command".to_owned(),
          "export" => "export command".to_owned(),
          "wc" => "wc command".to_owned(),
          "nano" => "nano command".to_owned(),
          "vi" => "vi command".to_owned(),
          "vim" => "vim command".to_owned(),
          "emacs" => "emacs command".to_owned(),
          "sed" => "sed command".to_owned(),
          "chmod" => "chmod command".to_owned(),
          "chown" => "chown command".to_owned(),
          "chgrp" => "chgrp command".to_owned(),
          "useradd" => "useradd command".to_owned(),
          "userdel" => "userdel command".to_owned(),
          "passwd" => "passwd command".to_owned(),
          "su" => "su command".to_owned(),
          "sudo" => "sudo command".to_owned(),
          "ln" => "ln command".to_owned(),
          "who" => "who command".to_owned(),
          "whatis" => "whatis command".to_owned(),
          "whereis" => "whereis command".to_owned(),
          "top" => "top command".to_owned(),
          "which" => "which command".to_owned(),
          "ps" => "ps command".to_owned(),
          "man" => "man command".to_owned(),
          "" => " ".to_owned(),
          command => (command.to_owned() + ": command not found").to_owned(),
        }
    }
}