pub struct Pipe {
    data: String,
}

impl Pipe {
    pub fn new(data: &str) -> Pipe {
        Pipe {
            data: data.to_string()
        }
    }

    pub fn push(&mut self, data: &str) {
        self.data.push_str(data);
    }

    pub fn read(&self) -> String {
        self.data.clone()
    }
}
