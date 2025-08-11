use std::collections::HashMap;

pub struct FileSystem {
    root: Directory,
    current_path: String,
}

struct File {
    content: Vec<u8>,
}

struct Directory {
    entries: HashMap<String, FSNode>,
}

enum FSNode {
    File(File),
    Directory(Directory),
}

impl FileSystem {
    pub fn new() -> Self {
        let mut root = Directory {
            entries: HashMap::new(),
        };

        // Create basic directory structure here for now.
        let bin = Directory {
            entries: HashMap::new(),
        };
        let etc = Directory {
            entries: HashMap::new(),
        };
        let mut home = Directory {
            entries: HashMap::new(),
        };
        let soohoonchoi = Directory {
            entries: HashMap::new(),
        };
        home.entries
            .insert("soohoonchoi".into(), FSNode::Directory(soohoonchoi));
        root.entries.insert("bin".into(), FSNode::Directory(bin));
        root.entries.insert("etc".into(), FSNode::Directory(etc));
        root.entries.insert("home".into(), FSNode::Directory(home));

        Self {
            root,
            current_path: "/home/soohoonchoi".into(),
        }
    }

    pub fn create_file(&mut self, path: &str, content: &[u8]) -> Result<(), &'static str> {
        // TODO: Implement file creation logic
        Ok(())
    }

    pub fn read_file(&self, path: &str) -> Result<Vec<u8>, &'static str> {
        // TODO: Implement file reading logic
        Ok(Vec::new())
    }
}
