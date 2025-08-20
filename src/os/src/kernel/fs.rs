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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_filesystem() {
        let fs = FileSystem::new();
        assert_eq!(fs.next_ino, 2);
        assert!(fs.inodes.contains_key(&1));
        let root = fs.inodes.get(&1).unwrap();
        assert!(root.is_dir);
        assert_eq!(root.ino, 1);
    }

    #[test]
    fn test_inode_creation() {
        let data = b"test content".to_vec();
        let file = Inode::new_file(42, data.clone());
        assert_eq!(file.ino, 42);
        assert!(!file.is_dir);
        assert_eq!(file.size, data.len() as u32);
        assert_eq!(file.data, data);

        let dir = Inode::new_dir(43);
        assert_eq!(dir.ino, 43);
        assert!(dir.is_dir);
        assert_eq!(dir.size, 0);
        assert!(dir.data.is_empty());
    }

    #[test]
    fn test_lookup_root() {
        let fs = FileSystem::new();
        assert_eq!(fs.lookup("/"), Some(1));
    }

    #[test]
    fn test_create_and_lookup_file() {
        let mut fs = FileSystem::new();
        let content = b"hello world".to_vec();
        
        assert!(fs.create("/test.txt", content.clone()));
        
        let ino = fs.lookup("/test.txt").unwrap();
        let inode = fs.inodes.get(&ino).unwrap();
        assert!(!inode.is_dir);
        assert_eq!(inode.data, content);
    }

    #[test]
    fn test_create_file_invalid_parent() {
        let mut fs = FileSystem::new();
        let content = b"test".to_vec();
        
        assert!(!fs.create("/nonexistent/test.txt", content));
    }

    #[test]
    fn test_read_file() {
        let mut fs = FileSystem::new();
        let content = b"test data".to_vec();
        
        fs.create("/readme.txt", content.clone());
        let read_data = fs.read("/readme.txt").unwrap();
        assert_eq!(read_data, content);
    }

    #[test]
    fn test_read_nonexistent_file() {
        let fs = FileSystem::new();
        assert!(fs.read("/missing.txt").is_none());
    }

    #[test]
    fn test_read_directory_fails() {
        let fs = FileSystem::new();
        assert!(fs.read("/").is_none());
    }

    #[test]
    fn test_write_file() {
        let mut fs = FileSystem::new();
        let initial_content = b"initial".to_vec();
        let new_content = b"updated content".to_vec();
        
        fs.create("/file.txt", initial_content);
        assert!(fs.write("/file.txt", new_content.clone()));
        
        let read_data = fs.read("/file.txt").unwrap();
        assert_eq!(read_data, new_content);
    }

    #[test]
    fn test_write_nonexistent_file() {
        let mut fs = FileSystem::new();
        let content = b"test".to_vec();
        assert!(!fs.write("/missing.txt", content));
    }

    #[test]
    fn test_write_directory_fails() {
        let mut fs = FileSystem::new();
        let content = b"test".to_vec();
        assert!(!fs.write("/", content));
    }

    #[test]
    fn test_mkdir() {
        let mut fs = FileSystem::new();
        
        assert!(fs.mkdir("/documents"));
        
        let ino = fs.lookup("/documents").unwrap();
        let inode = fs.inodes.get(&ino).unwrap();
        assert!(inode.is_dir);
    }

    #[test]
    fn test_mkdir_invalid_parent() {
        let mut fs = FileSystem::new();
        assert!(!fs.mkdir("/nonexistent/subdir"));
    }

    #[test]
    fn test_ls_root() {
        let mut fs = FileSystem::new();
        fs.create("/file1.txt", b"content1".to_vec());
        fs.mkdir("/dir1");
        
        let entries = fs.ls("/").unwrap();
        assert_eq!(entries.len(), 2);
        assert!(entries.contains(&"file1.txt".to_string()));
        assert!(entries.contains(&"dir1".to_string()));
    }

    #[test]
    fn test_ls_subdirectory() {
        let mut fs = FileSystem::new();
        fs.mkdir("/docs");
        fs.create("/docs/readme.md", b"readme content".to_vec());
        
        let entries = fs.ls("/docs").unwrap();
        assert_eq!(entries.len(), 1);
        assert!(entries.contains(&"readme.md".to_string()));
    }

    #[test]
    fn test_ls_nonexistent_directory() {
        let fs = FileSystem::new();
        assert!(fs.ls("/missing").is_none());
    }

    #[test]
    fn test_ls_file_fails() {
        let mut fs = FileSystem::new();
        fs.create("/file.txt", b"content".to_vec());
        assert!(fs.ls("/file.txt").is_none());
    }

    #[test]
    fn test_nested_directory_operations() {
        let mut fs = FileSystem::new();
        
        assert!(fs.mkdir("/home"));
        assert!(fs.mkdir("/home/user"));
        assert!(fs.create("/home/user/config.txt", b"config data".to_vec()));
        
        let config_data = fs.read("/home/user/config.txt").unwrap();
        assert_eq!(config_data, b"config data".to_vec());
        
        let user_entries = fs.ls("/home/user").unwrap();
        assert_eq!(user_entries.len(), 1);
        assert!(user_entries.contains(&"config.txt".to_string()));
    }

    #[test]
    fn test_inode_consistency() {
        let mut fs = FileSystem::new();
        fs.create("/test.txt", b"test".to_vec());
        
        let ino = fs.lookup("/test.txt").unwrap();
        let inode = fs.inodes.get(&ino).unwrap();
        assert_eq!(inode.ino, ino);
    }
}
