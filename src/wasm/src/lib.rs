use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// pub enum FileSystemNode {
//     Directory(Directory),
//     File(File),
//     SymLink(SymLink),
// }
// #[wasm_bindgen]
// pub trait File {
//     name: String,
//     permission: Integer,
// }

// #[wasm_bindgen]
// pub struct Directory {
//     name: String,
//     parent: String,
//     children: Vec<FileSystemNode>,
// }

// #[wasm_bindgen]
// pub struct Symlink {
//     name: String,
//     link: String,
// }

// #[wasm_bindgen]
// pub struct FileSystem {
//     root: Directory
// }

// #[wasm_bindgen]
// impl FileSystem {
//     pub fn new() -> FileSystem {
//         FileSystem { root: Directory::new('', '') }
//     }
// }

// #[wasm_bindgen]
// impl Directory {
//     pub fn new(dir_name pa) -> Directory {
//         Directory {
//             name: dir_name,
//             parent: parent_directory,
//             children: Vec<FileSystemNode>::new()
//         }
//     }

//     pub fn add_file(&mut self, name: String, size: u32) {
//         self.files.push(File { name, size });
//     }

//     pub fn get_files(&self) -> String {
//         let mut result = String::new();
//         for file in &self.files {
//             result.push_str(&format!("{}: {}\n", file.name, file.permission));
//         }
//         result
//     }

//     pub fn remove_file(&mut self, name: String) {
//         self.files.retain(|file| file.name != name);
//     }
// }