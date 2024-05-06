use std::rc::Rc;
use std::cell::RefCell;

use wasm_bindgen::prelude::*;
use web_sys::console;

mod shell;
mod filesystem;

use shell::lexer::Lexer;
use shell::exec::Exec;
use filesystem::directory::Directory;
use filesystem::pipe::Pipe;

#[wasm_bindgen]
pub struct Shell {
    lexer: Lexer,
    exec: Exec,
    // root: Rc<RefCell<Directory>>,
    // current: Rc<RefCell<Directory>>,
    // pipe: Pipe,
}

/**
 * Add initial filesystem structure read (from json?)
 * mock filesystem structure for now
 */
#[wasm_bindgen]
impl Shell {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Shell {
        console::log_1(&"Creating new shell".into());
        let root = Rc::new(RefCell::new(Directory::new("root".to_string(), None)));
        Shell {
            lexer: Lexer::new(),
            exec: Exec::new(root),
            // root,
            // current: root,
            // pipe: Pipe::new(""),
        }
    }
    
    /** Only one statement for now */
    pub fn run(&mut self, input: &str) {
        self.exec.execute(self.lexer.lex(input));

    }
}