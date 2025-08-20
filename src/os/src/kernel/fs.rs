use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct FileDescriptor(pub u32);

impl FileDescriptor {
    pub const STDIN: FileDescriptor = FileDescriptor(0);
    pub const STDOUT: FileDescriptor = FileDescriptor(1);
    pub const STDERR: FileDescriptor = FileDescriptor(2);

    pub fn is_valid(&self) -> bool {
        self.0 < 16
    }
}

#[derive(Debug, Clone)]
pub struct File {
    pub content: String,
}

pub struct FileSystem {
    pub files: HashMap<String, File>,
}

impl FileSystem {
    pub fn new() -> Self {
        let mut files = HashMap::new();
        files.insert(
            "test.txt".to_string(),
            File {
                content: "Hello from filesystem!".to_string(),
            },
        );
        files.insert(
            "program.exe".to_string(),
            File {
                content: "Executable program content".to_string(),
            },
        );

        Self { files }
    }

    pub fn create_file(&mut self, path: String, content: String) {
        self.files.insert(path, File { content });
    }
}
