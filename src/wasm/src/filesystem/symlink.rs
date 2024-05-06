
pub struct SymLink {
    name: String,
    link: String,
}

impl SymLink {
    pub fn new(name: String, link: String) -> SymLink {
        SymLink {
            name,
            link,
        }
    }
}