pub enum Token {
    Command(String),
    Operator(String),
    Option(String),
    Argument(String),
    Quote(String),
    LParen(String),
    RParen(String),
}

pub struct Statement {
    pub command: String,
    pub operators: Vec<String>,
    pub options: Vec<String>,
    pub arguments: Vec<String>,
}

impl Statement {
    pub fn new() -> Statement {
        Statement {
            command: String::new(),
            operators: Vec::new(),
            options: Vec::new(),
            arguments: Vec::new(),
        }
    }

    pub fn push(&mut self, token: Token) {
        match token {
            Token::Command(command) => self.command = command,
            Token::Operator(operator) => self.operators.push(operator),
            Token::Option(option) => self.options.push(option),
            Token::Argument(argument) => self.arguments.push(argument),
            _ => {}
        }
    }
}

pub struct Lexer {}

impl Lexer {
    pub fn new() -> Lexer {
        Lexer {}
    }

    pub fn lex(&self, input: &str) -> Vec<Statement> {
        let mut statements = Vec::new();
        let mut current_statement = Statement::new();
        let mut input_split = input.split_whitespace();

        while let Some(token) = input_split.next() {
            match token {
                "|" | ">" | ">>" => {
                    current_statement.push(Token::Operator(token.to_string()));
                    statements.push(current_statement);
                    current_statement = Statement::new();
                }

                "'" | "\"" => {
                    let mut quote = token.to_string();
                    while let Some(next_token) = input_split.next() {
                        quote.push_str(" ");
                        quote.push_str(next_token);
                        if next_token.ends_with(token) {
                            break;
                        }
                    }
                    current_statement.push(Token::Quote(quote));
                }
                _ => {
                    if current_statement.command.is_empty() {
                        current_statement.push(Token::Command(token.to_string()));
                    } else if token.starts_with("--") {
                        current_statement.push(Token::Option(token.to_string()));
                    } else if token.starts_with("-") {
                        token.chars().skip(1).for_each(|c| {
                            current_statement.push(Token::Option(c.to_string()));
                        });
                    } else {
                        current_statement.push(Token::Argument(token.to_string()));
                    }
                }
            }
        }

        statements.push(current_statement);
        statements
    }
}
