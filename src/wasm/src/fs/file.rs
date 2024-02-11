use crate::directory::Directory;

pub struct File {
    name: String,
    data: String,
    parent: Box<Directory>
}

impl File {
    pub fn new(name: String, data: String, parent: Box<Directory>) -> File {
        File {
            name,
            data,
            parent,
        }
    }

    pub fn get_name(&self) -> &String {
        &self.name
    }

    pub fn parent_name(&self) -> String {
       self.parent.get_name()
    }

    pub fn read(&self) -> String {
        self.data.clone()
    }
    pub fn write(&mut self, data: String) {
        self.data = data;
    }
}
