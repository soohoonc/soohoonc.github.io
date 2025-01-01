use std::cell::RefCell;
use std::path::Path;
use std::rc::Rc;

use wasm_bindgen::prelude::*;
// use web_sys::console;
use serde_json;

mod fs;
mod shell;

use fs::directory::Directory;
use fs::file::File;
use fs::node::{Node, NodeType};
use shell::exec::Exec;
use shell::lexer::Lexer;
// use filesystem::pipe::Pipe;

#[wasm_bindgen]
pub struct Shell {
    lexer: Lexer,
    exec: Exec,
    root: Rc<RefCell<Node>>,
    current: Rc<RefCell<Node>>,
    // pipe: Pipe,
    user: Rc<RefCell<String>>,
    hostname: Rc<RefCell<String>>,
}

#[wasm_bindgen]
impl Shell {
    #[wasm_bindgen(constructor)]
    pub fn new(user: String, hostname: String) -> Shell {
        let root = Rc::new(RefCell::new(Node::new(
            "".to_string(),
            NodeType::Directory(Directory::new("".to_string(), Vec::new())),
            None,
        )));

        Shell {
            lexer: Lexer::new(),
            exec: Exec::new(),
            current: Rc::clone(&root),
            root,
            // pipe: Pipe::new(""),
            user: Rc::new(RefCell::new(user)),
            hostname: Rc::new(RefCell::new(hostname)),
        }
    }

    /** Only one statement for now */
    pub fn run(&mut self, input: &str) -> String {
        let statement = self.lexer.lex(input);
        let result = self.exec.execute(
            statement,
            &self.root,
            &self.current,
            &self.user,
            &self.hostname,
        );
        // console::log_1(&result.clone().into());

        let output_str = serde_json::to_string(&result).unwrap();
        // console::log_1(&output_str.clone().into());
        output_str
    }
}
