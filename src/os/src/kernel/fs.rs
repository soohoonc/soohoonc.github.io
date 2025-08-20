use std::collections::HashMap;

pub type Ino = u32;

#[derive(Debug, Clone)]
pub struct Inode {
    pub ino: Ino,
    pub is_dir: bool,
    pub size: u32,
    pub data: Vec<u8>,
    pub entries: HashMap<String, Ino>,
}

impl Inode {
    pub fn new_file(ino: Ino, data: Vec<u8>) -> Self {
        Self {
            ino,
            is_dir: false,
            size: data.len() as u32,
            data,
            entries: HashMap::new(),
        }
    }

    pub fn new_dir(ino: Ino) -> Self {
        Self {
            ino,
            is_dir: true,
            size: 0,
            data: Vec::new(),
            entries: HashMap::new(),
        }
    }
}

pub struct FileSystem {
    inodes: HashMap<Ino, Inode>,
    next_ino: Ino,
}

impl FileSystem {
    pub fn new() -> Self {
        let mut fs = Self {
            inodes: HashMap::new(),
            next_ino: 2,
        };

        let root = Inode::new_dir(1);
        fs.inodes.insert(1, root);
        fs
    }

    fn alloc_ino(&mut self) -> Ino {
        let ino = self.next_ino;
        self.next_ino += 1;
        ino
    }

    fn lookup(&self, path: &str) -> Option<Ino> {
        if path == "/" {
            return Some(1);
        }

        let mut ino = 1;
        for name in path.trim_start_matches('/').split('/') {
            if name.is_empty() {
                continue;
            }
            let inode = self.inodes.get(&ino)?;
            if !inode.is_dir {
                return None;
            }
            ino = *inode.entries.get(name)?;
        }
        Some(ino)
    }

    pub fn create(&mut self, path: &str, data: Vec<u8>) -> bool {
        let (parent_path, name) = match path.rfind('/') {
            Some(i) => (&path[..i.max(1)], &path[i + 1..]),
            None => return false,
        };

        let parent_ino = match self.lookup(parent_path) {
            Some(ino) => ino,
            None => return false,
        };

        let file_ino = self.alloc_ino();
        let file = Inode::new_file(file_ino, data);
        assert_eq!(file.ino, file_ino);
        self.inodes.insert(file_ino, file);

        if let Some(parent) = self.inodes.get_mut(&parent_ino) {
            parent.entries.insert(name.to_string(), file_ino);
            true
        } else {
            false
        }
    }

    pub fn read(&self, path: &str) -> Option<Vec<u8>> {
        let ino = self.lookup(path)?;
        let inode = self.inodes.get(&ino)?;

        if inode.ino != ino {
            return None;
        }

        if inode.is_dir {
            return None;
        }
        Some(inode.data.clone())
    }

    pub fn write(&mut self, path: &str, data: Vec<u8>) -> bool {
        let ino = match self.lookup(path) {
            Some(ino) => ino,
            None => return false,
        };

        if let Some(inode) = self.inodes.get_mut(&ino) {
            if inode.ino != ino {
                return false;
            }

            if !inode.is_dir {
                inode.data = data;
                inode.size = inode.data.len() as u32;
                true
            } else {
                false
            }
        } else {
            false
        }
    }

    pub fn mkdir(&mut self, path: &str) -> bool {
        let (parent_path, name) = match path.rfind('/') {
            Some(i) => (&path[..i.max(1)], &path[i + 1..]),
            None => return false,
        };

        let parent_ino = match self.lookup(parent_path) {
            Some(ino) => ino,
            None => return false,
        };

        let dir_ino = self.alloc_ino();
        let dir = Inode::new_dir(dir_ino);
        assert_eq!(dir.ino, dir_ino);
        self.inodes.insert(dir_ino, dir);

        if let Some(parent) = self.inodes.get_mut(&parent_ino) {
            parent.entries.insert(name.to_string(), dir_ino);
            true
        } else {
            false
        }
    }

    pub fn ls(&self, path: &str) -> Option<Vec<String>> {
        let ino = self.lookup(path)?;
        let inode = self.inodes.get(&ino)?;
        if !inode.is_dir {
            return None;
        }
        Some(inode.entries.keys().cloned().collect())
    }
}
