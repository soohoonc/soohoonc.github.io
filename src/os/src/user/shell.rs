pub struct Shell {
    current_dir: String,
    history: Vec<String>,
}

impl Program for Shell {
    fn handle_message(&mut self, msg: Message) -> Result<(), String> {
        match msg {
            Message::UserInput(cmd) => self.execute_command(&cmd), // ... handle other messages
        }
    }
}
