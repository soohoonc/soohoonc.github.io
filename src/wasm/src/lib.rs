use std::rc::Rc;
use std::cell::RefCell;

use wasm_bindgen::prelude::*;
// use web_sys::console;
use serde_json;

mod shell;
mod filesystem;

use shell::lexer::Lexer;
use shell::exec::Exec;
use filesystem::node::Node;
use filesystem::create::create_fs;
// use filesystem::pipe::Pipe;

#[wasm_bindgen]
pub struct Shell {
    lexer: Lexer,
    exec: Exec,
    root: Rc<RefCell<Node>>,
    current: Rc<RefCell<Node>>,
    // pipe: Pipe,
    user: String,
    hostname: String,
}

#[wasm_bindgen]
impl Shell {
    #[wasm_bindgen(constructor)]
    pub fn new(user: String, hostname: String) -> Shell {
        // hardcoded for now
        let root = create_fs(std::path::Path::new("."));
        // let current = root.borrow().get("/user/guest").unwrap();
        Shell {
            lexer: Lexer::new(),
            exec: Exec::new(Rc::clone(&root), Rc::clone(&root)),
            // current,
            current: Rc::clone(&root),
            root,
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
            let output = serde_json::json!({
                "result": result,
                "user": self.user,
                "host": self.hostname,
                "path": self.current.borrow().get_name(),
            });

            let output_str = serde_json::to_string(&output).unwrap();
            // console::log_1(&output_str.clone().into());
            output_str
        }
}