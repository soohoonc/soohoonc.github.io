use crate::kernel::user::FileDescriptor;

pub struct Echo;

impl Echo {
    pub fn main(args: &[String]) -> Result<(), String> {
        let output = args[1..].join(" ") + "\n";
        Ok(())
    }
}
