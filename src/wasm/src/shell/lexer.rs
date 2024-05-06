/**
 * Parse commands, by space, arguments and options for now.
 */

pub enum Token {
  Command(String),
  Option(String),
  Argument(String),
}

pub struct Statement {
  pub command: String,
  pub options: Vec<String>,
  pub arguments: Vec<String>,
}

impl Statement {
  pub fn new() -> Statement {
      Statement {
          command: String::new(),
          options: Vec::new(),
          arguments: Vec::new(),
      }
  }

  pub fn push(&mut self, token: Token) {
      match token {
          Token::Command(command) => self.command = command,
          Token::Option(option) => self.options.push(option),
          Token::Argument(argument) => self.arguments.push(argument),
      }
  }
}

pub struct Lexer {}

impl Lexer {
  pub fn new() -> Lexer {
      Lexer {}
  }

  /** A shitty lexer for now... only one statement at a time
   * Want to add piping and redirections later
   */
  pub fn lex(&self, input: &str) -> Statement {
      let mut statement = Statement::new();
      let mut input_split = input.split_whitespace();

      if let Some(command) = input_split.next() {
          statement.push(Token::Command(command.to_string()));
          for argument in input_split {
              if argument.starts_with("--") {
                  statement.push(Token::Option(argument.to_string()));
              } else if argument.starts_with("-") {
                argument.chars().skip(1).for_each(|c| {
                  statement.push(Token::Option(c.to_string()));
                });
              } else {
                  statement.push(Token::Argument(argument.to_string()));
              }
          }
      }
      statement
  }
}