struct Window {
    pid: i16,
    x: i16,
    y: i16,
    z: i16,
    h: i16,
    w: i16,
    hidden: bool,
    title: String,
}

pub struct WindowManger {
    windows: Vec<Window>,
    active_window: Option<i16>,

    pub fn new(&mut self) {
      windows = Vec::new();
    }

    pub fn create_window(&mut self, pid: i16) -> i16 {

    }

    pub fn select_window(&mut self, id: i16) {
      
    }

    pub fn move_window(&mut self, id: i16, x: i16, y: i16) {

    }

    pub fn hide_window(&mut self, id: i16) {

    }

    pub fn close_window(&mut self, id: i16) {

    }
}
