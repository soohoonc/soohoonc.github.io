
use std::rc::Rc;
use std::cell::RefCell;
use wasm_bindgen::prelude::*;
use web_sys::console;

use crate::filesystem::node::{Node, NodeType};
use crate::filesystem::directory::Directory;
use crate::filesystem::file::File;
// use crate::filesystem::directory::Directory;
use crate::shell::lexer::Statement;

pub struct Exec {
    root: Rc<RefCell<Node>>,
    current: Rc<RefCell<Node>>,
}

impl Exec {
  pub fn new(root: Rc<RefCell<Node>>, current: Rc<RefCell<Node>>) -> Exec {
      Exec {
        root,
        current,
      }
  }

  pub fn get_current(&self) -> Rc<RefCell<Node>> {
    Rc::clone(&self.current)
  }

  pub fn get_user(&self) -> String {
    "guest".to_owned()
  }

  pub fn get_hostname(&self) -> String {
    "soohoonchoi.com".to_owned()
  }

fn ls(&self) -> String {
    let mut children: Vec<String> = Vec::new();
    let current_node = self.current.borrow();
    for child in current_node.get_children() {
        children.push(child.borrow().get_name().to_owned());
    }
    serde_json::to_string(&children).unwrap()
}

  fn pwd(&self) -> String {
    let mut path_string = String::new();
    let mut current_node = Rc::clone(&self.current);
    loop {
      path_string = format!("{}/{}", current_node.borrow().get_name(), path_string);
        let parent = current_node.borrow().get_parent();
        console::log_1(&JsValue::from_str(&current_node.borrow().get_name()));
        match parent {
            Some(p) => {
              console::log_1(&JsValue::from_str(&p.borrow().get_name()));
              current_node = Rc::clone(&p)
            },
            None => break,
        }
    }
    serde_json::to_string(&path_string).unwrap()
}
  fn cd(&mut self, args: Vec<String>) -> String {
    let new_path = {
        if args.first().is_some() {
            args.first().unwrap().clone()
        } else {
            "/".to_owned()
        }
    };
    let mut current_node = Rc::clone(&self.current);
    console::log_1(&JsValue::from_str(new_path.as_str()));
    for path in new_path.split("/").filter(|&x| !x.is_empty()) {
        // console::log_1(&JsValue::from_str(path));
        if path == "." {
            continue;
        } else if path == ".." {
            let parent = self.current.borrow().get_parent();
            match parent {
                Some(parent) => current_node = parent,
                None => ()
            }
        } else {
            let mut found = false;
            // console::log_1(&JsValue::from_str("Searching"));
            let children = current_node.borrow().get_children();
            for child in children {
                // console::log_1(&JsValue::from_str(child.borrow().get_name().as_str()));
                let child_node = Rc::clone(&child);
                // console::log_2(&JsValue::from_str(&child_node.get_name()), &JsValue::from_str(path));
                let child_node_type = child_node.borrow().get_node_type();
                if child_node.borrow().get_name() == path {
                    match child_node_type {
                        NodeType::Directory(_) => {
                            current_node = child_node;
                            found = true;
                            break;
                        },
                        NodeType::File(_) => {
                            return "Not a directory".to_string();
                        }
                    }
                }
            }
            if !found {
                return "Directory not found".to_string();
            }
        }
    }
    self.current = current_node;
    return " ".to_string()
  }

  fn mkdir(&mut self, args: Vec<String>) -> String {
    // let new_node = Rc::new(RefCell::new(Node::new(new_dir, NodeType::Directory, Some(Rc::clone(&self.current))));
    // self.current.borrow_mut().add_child(Rc::clone(&new_node));
    // Ok(JsValue::from_str("Success"))
    if args.len() == 0 {
        return "usage: mkdir [-pv] [-m mode] directory_name ...".to_string()
    } 
    let new_path = args.first().unwrap().clone();
    let mut current_node = Rc::clone(&self.current);
    if current_node.borrow().as_directory().is_none() {
        return "Not a directory".to_string();
    }

    for path in new_path.split("/").filter(|&x| !x.is_empty()) {
        let mut found = false;
        let children = current_node.borrow().get_children();
        for child in children {
            let child_node_type = child.borrow().get_node_type();
            let child_node_name = child.borrow().get_name();
            if child_node_name == path {
                match child_node_type {
                    NodeType::Directory(_) => {
                        current_node = Rc::clone(&child); // Use the cloned child
                        found = true;
                        break;
                    },
                    NodeType::File(_) => {
                        return "Not a directory".to_string();
                    }
                }
            }
        }
        if !found {
            let new_node = Rc::new(RefCell::new(Node::new(path.to_string(), NodeType::Directory(Directory::new(
                path.to_string(),
                Vec::new()
            )), Some(Rc::clone(&current_node)))));
            current_node.borrow_mut().add_child(Rc::clone(&new_node));
            current_node = Rc::clone(&new_node);
        }
      }
      " ".to_string()
  }

  fn echo(&self, args: Vec<String>) -> String {
    let mut output = String::new();
    for arg in args {
        output.push_str(arg.as_str());
        output.push_str(" ");
    }
    output
  }

  fn touch(&self, args: Vec<String>) -> String {
    if args.first().is_none() {
        return "usage: touch file_name".to_string()
    }
    let new_file = args.first().unwrap().clone();
    let cloned_new_file = new_file.clone();
    let new_node = Rc::new(RefCell::new(Node::new(cloned_new_file, NodeType::File(
        File::new(new_file, "".to_string())
    ), Some(Rc::clone(&self.current)))));
    self.current.borrow_mut().add_child(Rc::clone(&new_node));
    " ".to_string()
  }

    pub fn execute(&mut self, input: Statement) -> String {
        match &input.command[..] {
          "" => " ".to_owned(),
          "github" => "<a href=\"https://github.com/soohoonc/\" target=\"_blank\">github</a>".to_owned(),
          "help" => serde_json::to_string("<p className=\"text-emerald-500\">\nhelp command\n</p>").unwrap(),
          "license" => "license command".to_owned(),
          "ls" => Self::ls(self),
          "pwd" => Self::pwd(self),
          "cd" => Self::cd(self, input.arguments),
          "clear" => "".to_owned(),
          "echo" => Self::echo(self, input.arguments),
          "cat" => "cat command".to_owned(),
          "touch" => Self::touch(self, input.arguments),
          "mkdir" => Self::mkdir(self, input.arguments),
          "rm" => "rm command".to_owned(),
          "rmdir" => "rmdir command".to_owned(),
          "mv" => "mv command".to_owned(),
          "cp" => "cp command".to_owned(),
          "exit" => "Goodbye!".to_owned(),
          "whoami" => "root".to_owned(),
          "which" => "which command".to_owned(),
          // "alias" => "alias command".to_owned(),
          // "env" => "env command".to_owned(),
          // "grep" => "grep command".to_owned(),
          // "find" => "find command".to_owned(),
          // "export" => "export command".to_owned(),
          // "wc" => "wc command".to_owned(),
          // "nano" => "nano command".to_owned(),
          // "vi" => "vi command".to_owned(),
          // "vim" => "vim command".to_owned(),
          // "emacs" => "emacs command".to_owned(),
          // "sed" => "sed command".to_owned(),
          // "chmod" => "chmod command".to_owned(),
          // "chown" => "chown command".to_owned(),
          // "chgrp" => "chgrp command".to_owned(),
          // "useradd" => "useradd command".to_owned(),
          // "userdel" => "userdel command".to_owned(),
          // "passwd" => "passwd command".to_owned(),
          // "su" => "su command".to_owned(),
          // "sudo" => "sudo command".to_owned(),
          // "ln" => "ln command".to_owned(),
          // "who" => "who command".to_owned(),
          // "top" => "top command".to_owned(),
          // "man" => "man command".to_owned(),
          command => (command.to_owned() + ": command not found").to_owned(),
        }
    }
}