pub struct Init {
    services: HashMap<String, ProcessID>,
}

impl Program for Init {
    fn init(&mut self) -> Result<(), String> {
        // Init system is first process, manages other system processes
        Ok(())
    }

    fn handle_message(&mut self, msg: Message) -> Result<(), String> {
        match msg {
            Message::ChildTerminated(pid) => {
                // Restart critical system services if they die
                self.restart_service(pid)
            } // ... handle other messages
        }
    }
}
