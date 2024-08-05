
type Message = {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

type Shell = {
	run: (command: string) => string;
}

type ShellStateAction =
  | { type: 'addHistory'; payload: Message }
  | { type: 'clearHistory' }
  | { type: 'setUser'; payload: string }
  | { type: 'setHostname'; payload: string }
  | { type: 'setShell'; payload: Shell };

type ShellState = {
	history: Message [];
	user: string;
	hostname: string;
	shell: Shell
};
  