
#[derive(Clone, PartialEq)]
pub struct File {
    pub name: String,
    data: String,
}

impl File {
    pub fn new(name: String, data: String) -> File {
        File {
            name,
            data,
        }
    }
    pub fn read(&self) -> String {
        self.data.clone()
    }
    pub fn write(&mut self, data: String) {
        self.data = data;
    }
}
