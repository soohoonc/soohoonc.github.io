use std::rc::Rc;
use std::cell::RefCell;

use wasm_bindgen::prelude::*;
// use web_sys::console;
use serde_json;

mod shell;
mod filesystem;

use shell::lexer::Lexer;
use shell::exec::Exec;
use filesystem::node::{Node, NodeType};
use filesystem::directory::Directory;
// use filesystem::pipe::Pipe;


#[wasm_bindgen]
pub struct Shell {
    lexer: Lexer,
    exec: Exec,
    // root: Rc<RefCell<Node>>,
    current: Rc<RefCell<Node>>,
    // pipe: Pipe,
    user: String,
    hostname: String,
}

#[wasm_bindgen]
impl Shell {
    #[wasm_bindgen(constructor)]
    pub fn new(user: String, hostname: String) -> Shell {
        let root = Rc::new(RefCell::new(
            Node::new("".to_string(), NodeType::Directory(Directory::new(
                "".to_string(),
                Vec::new()
    )), None)
        ));

        Shell {
            lexer: Lexer::new(),
            exec: Exec::new(Rc::clone(&root), Rc::clone(&root)),
            current: Rc::clone(&root),
            // root,
            // pipe: Pipe::new(""),
            user,
            hostname,
        }
    }
    
    /** Only one statement for now */
        pub fn run(&mut self, input: &str) -> String {
            let statement = self.lexer.lex(input);
            let result = self.exec.execute(statement);
            // console::log_1(&result.clone().into());
            self.current = Rc::clone(&self.exec.get_current());
            self.user = self.exec.get_user();
            self.hostname = self.exec.get_hostname();

            let output = serde_json::json!({
                "result": result,
                "user": self.exec.get_user(),
                "host": self.exec.get_hostname(),
                "path": self.exec.get_current().borrow().get_name(),
            });

            let output_str = serde_json::to_string(&output).unwrap();
            // console::log_1(&output_str.clone().into());
            output_str
        }
}