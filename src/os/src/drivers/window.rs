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
    display_server: Option<ProcessID>,
}

impl Program for WindowManager {
    fn init(&mut self) -> Result<(), String> {
        // Start display server
        self.display_server = Some(syscall(SystemCall::CreateProcess {
            name: "display_server".into(),
            parent: get_current_pid(),
        })?);
        Ok(())
    }
}
