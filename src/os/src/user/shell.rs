pub struct Shell {
    current_dir: String,
    history: Vec<String>,
}

impl Shell {
    pub fn new() -> Self {
        Self {
            current_dir: "/".into(),
            history: Vec::new(),
        }
    }

    pub fn execute(&mut self, command: &str) -> Result<String, &'static str> {
        self.history.push(command.to_string());

        let parts: Vec<&str> = command.split_whitespace().collect();
        match parts.get(0).map(|&s| s) {
            Some("ls") => Ok("Directory listing...".into()),
            Some("cd") => {
                if let Some(&dir) = parts.get(1) {
                    self.current_dir = dir.into();
                    Ok(format!("Changed directory to {}", dir))
                } else {
                    Ok("Usage: cd <directory>".into())
                }
            }
            _ => Ok("Command not found".into()),
        }
    }
}
