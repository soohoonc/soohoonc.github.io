
use std::rc::Rc;
use std::cell::RefCell;
use serde_json::Value;
use wasm_bindgen::prelude::*;
use web_sys::console;

use crate::filesystem::node::{Node, NodeType};
use crate::filesystem::directory::Directory;
use crate::filesystem::file::File;
// use crate::filesystem::directory::Directory;
use crate::shell::lexer::Statement;

pub struct Exec {}

impl Exec {
  pub fn new() -> Exec {
      Exec {}
  }

fn ls(current: &Rc<RefCell<Node>>) -> String {
    let mut children: Vec<String> = Vec::new();
    let current_node = current.borrow();
    for child in current_node.get_children() {
        children.push(child.borrow().get_name().to_owned());
    }
    serde_json::to_string(&children).unwrap()
}

  fn pwd(current: &Rc<RefCell<Node>>) -> String {
    let mut path_string = String::new();
    let mut current_node = Rc::clone(&current);
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
fn cd(current: &Rc<RefCell<Node>>, root: &Rc<RefCell<Node>>, args: Vec<String>) -> String {
    console::log_1(&"Entering cd function".into());

    let new_path = args.first().cloned().unwrap_or_else(|| "/".to_owned());
    console::log_1(&format!("New path: {}", new_path).into());

    let mut current_node = if new_path.starts_with("/") {
        console::log_1(&"Starting from root".into());
        Rc::clone(root)
    } else {
        console::log_1(&"Starting from current directory".into());
        Rc::clone(current)
    };

    for path in new_path.split('/').filter(|&x| !x.is_empty()) {
        console::log_1(&format!("Processing path segment: {}", path).into());

        match path {
            "." => continue,
            ".." => {
                let current_parent = current_node.borrow().get_parent();
                if let Some(parent) = current_parent {
                    current_node = parent;
                    console::log_1(&"Moved to parent directory".into());
                } else {
                    console::log_1(&"Already at root, can't go up".into());
                }
            },
            _ => {
                let children = current_node.borrow().get_children();
                let found_child = children.iter()
                    .find(|child| child.borrow().get_name() == path)
                    .cloned();

                match found_child {
                    Some(child) => {
                      let child_node_type = child.borrow().get_node_type();
                        if let NodeType::Directory(_) = child_node_type {
                            current_node = child;
                            console::log_1(&format!("Moved to directory: {}", path).into());
                        } else {
                            console::log_1(&format!("{} is not a directory", path).into());
                            return format!("{} is not a directory", path);
                        }
                    },
                    None => {
                        console::log_1(&format!("Directory not found: {}", path).into());
                        return format!("Directory not found: {}", path);
                    }
                }
            }
        }
    }

    // Update the current directory
    console::log_1(&"Updating current directory".into());
    {
        let mut current_mut = current.borrow_mut();
        *current_mut = current_node.borrow().clone();
    }
    
    console::log_1(&"CD operation completed successfully".into());
    " ".to_string()
}

  fn mkdir(current: &Rc<RefCell<Node>>, root: &Rc<RefCell<Node>>, args: Vec<String>) -> String {
    // let new_node = Rc::new(RefCell::new(Node::new(new_dir, NodeType::Directory, Some(Rc::clone(&self.current))));
    // self.current.borrow_mut().add_child(Rc::clone(&new_node));
    // Ok(JsValue::from_str("Success"))
    if args.len() == 0 {
        return "usage: mkdir [-pv] [-m mode] directory_name ...".to_string()
    } 
    let new_path = args.first().unwrap().clone();
    let mut current_node = {
      if new_path.starts_with("/") {
        Rc::clone(&root)
      } else {
        Rc::clone(&current)
      }
    };
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
    output.push_str(" ");
    output
  }

  fn touch(current: &Rc<RefCell<Node>>, args: Vec<String>) -> String {
    if args.first().is_none() {
        return "usage: touch file_name".to_string()
    }
    let new_file = args.first().unwrap().clone();
    let cloned_new_file = new_file.clone();
    let new_node = Rc::new(RefCell::new(Node::new(cloned_new_file, NodeType::File(
        File::new(new_file, " ".to_string())
    ), Some(Rc::clone(&current)))));
    current.borrow_mut().add_child(Rc::clone(&new_node));
    " ".to_string()
  }

fn cat(current: &Rc<RefCell<Node>>, root: &Rc<RefCell<Node>>, args: Vec<String>) -> String {
    if args.is_empty() {
        return "usage: cat file_name".to_string();
    }
    
    let file_name = args[0].clone();
    let mut current_node = if file_name.starts_with("/") {
        Rc::clone(&root)
    } else {
        Rc::clone(&current)
    };
    
    let parts: Vec<&str> = file_name.split('/').filter(|&x| !x.is_empty()).collect();
    let mut file_node: Option<File> = None;
    let mut found = false;
    
    for (i, node) in parts.iter().enumerate() {
        let children = current_node.borrow().get_children();
        for child in children {
            let child_node = Rc::clone(&child);
            if child_node.borrow().get_name() == *node {
                match child_node.borrow().get_node_type() {
                    NodeType::File(ref file) => {
                        if i == parts.len() - 1 {
                            file_node = Some(file.clone());
                            found = true;
                        } else {
                            return "Not a directory".to_string();
                        }
                    },
                    NodeType::Directory(_) => {
                        if i < parts.len() - 1 {
                            current_node = Rc::clone(&child_node);
                            found = true;
                        } else {
                            return "Unsupported action for cat".to_string();
                        }
                    }
                }
                break;  // Exit the inner loop once the match is found
            }
        }
        if !found {
            return "File not found".to_string();
        }
        found = false; // Reset found for the next iteration
    }
    
    match file_node {
        Some(file_node) => file_node.read(),
        None => "File not found".to_string(),
    }
}

fn write(current: &Rc<RefCell<Node>>, root: &Rc<RefCell<Node>>, args: Vec<String>) -> String {
  // Validate arguments
  if args.len() < 2 {
      return "usage: write file_name 'content'".to_string();
  }

  let file_name = args[0].clone();
  let content = args[1].clone();

  let mut current_node = if file_name.starts_with("/") {
      Rc::clone(&root)
  } else {
      Rc::clone(&current)
  };

  console::log_1(&JsValue::from_str(file_name.as_str()));
  console::log_1(&JsValue::from_str(content.as_str()));

  let parts: Vec<&str> = file_name.split('/').filter(|&x| !x.is_empty()).collect();
  let mut file_node: Option<Rc<RefCell<Node>>> = None;
  let mut found = false;

  for (i, node) in parts.iter().enumerate() {
      let children = current_node.borrow().get_children();
      for child in children {
          let child_node = Rc::clone(&child);
          if child_node.borrow().get_name() == *node {
              match child_node.borrow().get_node_type() {
                  NodeType::File(_) => {
                      if i == parts.len() - 1 {
                          file_node = Some(Rc::clone(&child));
                          found = true;
                      } else {
                          return "File not found".to_string();
                      }
                  },
                  NodeType::Directory(_) => {
                      if i < parts.len() - 1 {
                          current_node = Rc::clone(&child_node);
                          found = true;
                      } else {
                          return "Unsupported action for write".to_string();
                      }
                  }
              }
              break;  // Exit the inner loop once the match is found
          }
      }
      if !found {
          return "File not found".to_string();
      }
      found = false; // Reset found for the next iteration
  }

  match file_node {
      Some(file_node) => {
        match file_node.borrow().get_node_type() {
          NodeType::Directory(_) => {
            return "Not a file".to_string();
          },
          NodeType::File(ref mut file) => {
            file.write(content)
          }
        }
      },
      None => return "File not found".to_string(),
  }
  return " ".to_string();
}

pub fn execute(
  &mut self,
  statements: Vec<Statement>,
  root: &Rc<RefCell<Node>>,
  current: &Rc<RefCell<Node>>,
  user: &Rc<RefCell<String>>,
  hostname: &Rc<RefCell<String>>
) -> Value {
  let mut output = String::new();
  // let mut previous_output = None;

  for (i, statement) in statements.iter().enumerate() {
      if i > 0 {
          if let Some(op) = statements[i - 1].operators.last() {
              match op.as_str() {
                  // "|" => {
                  //     // Handle piping (not implemented in this example)
                  //     // Assume piping is handled via previous_output
                  //     previous_output = Some(output.clone());
                  // }
                  // ">" => {
                  //     // Handle output redirection
                  //     if let Some(file_name) = statement.arguments.first() {
                  //         std::fs::write(file_name, output.clone()).expect("Unable to write file");
                  //         output.clear();
                  //     }
                  // }
                  // ">>" => {
                  //     // Handle append output redirection
                  //     if let Some(file_name) = statement.arguments.first() {
                  //         use std::fs::OpenOptions;
                  //         let mut file = OpenOptions::new().append(true).open(file_name).expect("Unable to open file");
                  //         use std::io::Write;
                  //         write!(file, "{}", output).expect("Unable to write file");
                  //         output.clear();
                  //     }
                  // }
                  _ => {}
              }
          }
      }

      output = match &statement.command[..] {
          "" => " ".to_owned(),
          "github" => "<a href=\"https://github.com/soohoonc/\" target=\"_blank\">github</a>".to_owned(),
          "help" => "<p className=\"text-emerald-500\">\nhelp command\n</p>".to_owned(),
          "license" => "license command".to_owned(),
          "ls" => Self::ls(current),
          "pwd" => Self::pwd(current),
          "cd" => Self::cd(current, root, statement.arguments.clone()),
          "clear" => "".to_owned(),
          "echo" => Self::echo(self, statement.arguments.clone()),
          "cat" => Self::cat(current, root, statement.arguments.clone()),
          "touch" => Self::touch(current, statement.arguments.clone()),
          "mkdir" => Self::mkdir(current, root, statement.arguments.clone()),
          "rm" => "rm command".to_owned(),
          "rmdir" => "rmdir command".to_owned(),
          "mv" => "mv command".to_owned(),
          "cp" => "cp command".to_owned(),
          "exit" => "Goodbye!".to_owned(),
          "whoami" => user.borrow().to_owned(),
          "host" => hostname.borrow().to_owned(),
          "which" => "which command".to_owned(),
          "write" => Self::write(current, root, statement.arguments.clone()),
          command => (command.to_owned() + ": command not found").to_owned(),
      };
  }

  // return json like object 
  let output = serde_json::json!({
    "result": output,
    "user": user.borrow().to_owned(),
    "host": hostname.borrow().to_owned(),
    "path": current.borrow().get_name(),
  });
  output
}
}