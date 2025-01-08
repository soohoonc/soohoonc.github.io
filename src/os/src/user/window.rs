use std::collections::HashMap;

type WindowID = u32;

pub struct Window {
    id: WindowID,
    title: String,
    position: (i32, i32),
    size: (u32, u32),
}

pub struct WindowManager {
    windows: HashMap<WindowID, Window>,
    next_window_id: WindowID,
}

impl WindowManager {
    pub fn new() -> Self {
        Self {
            windows: HashMap::new(),
            next_window_id: 1,
        }
    }

    pub fn create_window(&mut self, title: &str) -> WindowID {
        let id = self.next_window_id;
        self.next_window_id += 1;

        let window = Window {
            id,
            title: title.to_string(),
            position: (100, 100),
            size: (400, 300),
        };

        self.windows.insert(id, window);
        id
    }
}
