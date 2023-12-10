type Command = "help" | "clear" | "echo" | "ls" | "cd" | "pwd" | "whoami"

type Message =
  (React.ReactElement | string)