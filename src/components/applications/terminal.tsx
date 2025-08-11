'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useOs, type Application, type Process } from '@/providers/os';

export type MenuItem = {
  label: string
  dropdown: React.ReactNode
}

export const menuItems: MenuItem[] = [
  {
    label: 'Terminal',
    dropdown: <div>Terminal Menu</div>
  },
  {
    label: 'Shell', 
    dropdown: <div>Shell Menu</div>
  },
  {
    label: 'Edit',
    dropdown: <div>Edit Menu</div>
  }
]

type HistoryEntry = {
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
};

const user = 'user';
const hostname = 'ostep-os';

const Terminal = () => {
  const shellInputRef = useRef<HTMLSpanElement>(null);
  const os = useOs();
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      type: 'output',
      content: `Welcome to OSTEP OS Terminal!
Type 'help' to see available commands.

This terminal connects to a real UNIX-like kernel implementing
Operating Systems: Three Easy Pieces concepts.`,
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentDirectory, setCurrentDirectory] = useState('/home/user');

  const focusInput = useCallback(() => {
    shellInputRef.current?.focus();
  }, []);

  // OSTEP-compliant shell commands
  const executeCommand = useCallback(async (commandLine: string) => {
    const args = commandLine.trim().split(/\s+/);
    const command = args[0]?.toLowerCase();
    const params = args.slice(1);

    if (!command) return '';

    try {
      switch (command) {
        case 'help':
          return `Available OSTEP OS commands:
  
Process Management (Chapter 5):
  ps                    - List all processes
  spawn <name> <cmd>    - Spawn a new process
  fork <pid>            - Fork an existing process
  kill <pid>            - Send SIGKILL to process
  term <pid>            - Send SIGTERM to process
  stop <pid>            - Send SIGSTOP to process  
  cont <pid>            - Send SIGCONT to process
  wait <parent> [child] - Wait for child process
  exit <pid> <status>   - Exit process with status

System Information:
  whoami               - Current user
  hostname             - System hostname  
  pwd                  - Current directory
  uptime               - System uptime (simulated)
  clear                - Clear terminal
  help                 - Show this help

Examples:
  spawn calculator calc
  ps
  kill 123
  fork 1`;

        case 'ps':
          const processes = os.listProcesses();
          let output = 'PID\tPPID\tSTATE\t\tNAME\t\tCOMMAND\t\tCPU(ms)\tMEM(KB)\n';
          output += '─'.repeat(70) + '\n';
          
          processes.forEach(proc => {
            output += `${proc.processId}\t${proc.parentId}\t${proc.state.padEnd(8)}\t${proc.name.padEnd(8)}\t${proc.command.padEnd(8)}\t${proc.cpuTime}\t${Math.round(proc.memoryUsage / 1024)}\n`;
          });
          
          if (processes.length === 0) {
            output += 'No processes found.\n';
          }
          return output;

        case 'spawn':
          if (params.length < 2) {
            return 'Usage: spawn <name> <command> [args...]';
          }
          const app: Application = {
            name: params[0],
            command: params[1],
            args: params.slice(2)
          };
          const pid = await os.spawnProcess(app);
          return `Process spawned with PID: ${pid}`;

        case 'fork':
          if (params.length < 1) {
            return 'Usage: fork <parent_pid>';
          }
          const parentPid = parseInt(params[0]);
          if (isNaN(parentPid)) {
            return 'Error: PID must be a number';
          }
          const childPid = await os.forkProcess(parentPid);
          return `Forked process. New child PID: ${childPid}`;

        case 'kill':
          if (params.length < 1) {
            return 'Usage: kill <pid>';
          }
          const killPid = parseInt(params[0]);
          if (isNaN(killPid)) {
            return 'Error: PID must be a number';
          }
          if (killPid === 1) {
            return 'Error: Cannot kill init process (PID 1)';
          }
          await os.killProcess(killPid);
          return `Sent SIGKILL to process ${killPid}`;

        case 'term':
          if (params.length < 1) {
            return 'Usage: term <pid>';
          }
          const termPid = parseInt(params[0]);
          if (isNaN(termPid)) {
            return 'Error: PID must be a number';
          }
          await os.terminateProcess(termPid);
          return `Sent SIGTERM to process ${termPid}`;

        case 'stop':
          if (params.length < 1) {
            return 'Usage: stop <pid>';
          }
          const stopPid = parseInt(params[0]);
          if (isNaN(stopPid)) {
            return 'Error: PID must be a number';
          }
          await os.stopProcess(stopPid);
          return `Sent SIGSTOP to process ${stopPid}`;

        case 'cont':
          if (params.length < 1) {
            return 'Usage: cont <pid>';
          }
          const contPid = parseInt(params[0]);
          if (isNaN(contPid)) {
            return 'Error: PID must be a number';
          }
          await os.continueProcess(contPid);
          return `Sent SIGCONT to process ${contPid}`;

        case 'wait':
          if (params.length < 1) {
            return 'Usage: wait <parent_pid> [child_pid]';
          }
          const waitParentPid = parseInt(params[0]);
          const waitChildPid = params[1] ? parseInt(params[1]) : undefined;
          
          if (isNaN(waitParentPid) || (params[1] && isNaN(waitChildPid!))) {
            return 'Error: PIDs must be numbers';
          }
          
          const result = await os.waitForChild(waitParentPid, waitChildPid);
          return `Child process ${result.pid} exited with status ${result.exitStatus}`;

        case 'exit':
          if (params.length < 2) {
            return 'Usage: exit <pid> <status>';
          }
          const exitPid = parseInt(params[0]);
          const exitStatus = parseInt(params[1]);
          
          if (isNaN(exitPid) || isNaN(exitStatus)) {
            return 'Error: PID and status must be numbers';
          }
          
          if (exitPid === 1) {
            return 'Error: Cannot exit init process (PID 1)';
          }
          
          await os.exitProcess(exitPid, exitStatus);
          return `Process ${exitPid} exited with status ${exitStatus}`;

        case 'whoami':
          return user;

        case 'hostname':
          return hostname;

        case 'pwd':
          return currentDirectory;

        case 'cd':
          const newDir = params[0] || '/home/user';
          setCurrentDirectory(newDir);
          return '';

        case 'uptime':
          const currentProc = os.getCurrentProcess();
          return `System uptime: ${Math.floor(Date.now() / 1000)} seconds (simulated)
Current process: ${currentProc || 'None'}
OS State: ${os.state}`;

        case 'clear':
          setHistory([]);
          return '';

        default:
          return `Command not found: ${command}
Type 'help' for available commands.`;
      }
    } catch (error) {
      return `Error executing command: ${error instanceof Error ? error.message : String(error)}`;
    }
  }, [os, currentDirectory]);

  const handleCommand = useCallback(async (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add command to history
    setHistory(prev => [...prev, {
      type: 'command',
      content: `${user}@${hostname}:${currentDirectory}$ ${trimmedInput}`,
      timestamp: new Date()
    }]);

    // Execute command
    const output = await executeCommand(trimmedInput);
    
    // Add output to history if not empty
    if (output) {
      setHistory(prev => [...prev, {
        type: 'output',
        content: output,
        timestamp: new Date()
      }]);
    }

    setCurrentInput('');
  }, [executeCommand, currentDirectory]);

  return (
    <div
      className='font-mono flex flex-col overflow-y-scroll pt-2 pb-2 px-2 h-full'
      onClick={focusInput}
      style={{ backgroundColor: '#000000', color: '#00ff00' }}
    >
      <TerminalHistory history={history} />
      <TerminalInput 
        ref={shellInputRef}
        value={currentInput}
        onChange={setCurrentInput}
        onSubmit={handleCommand}
        prompt={`${user}@${hostname}:${currentDirectory}$ `}
      />
    </div>
  );
};

interface TerminalHistoryProps {
  history: HistoryEntry[];
}

const TerminalHistory: React.FC<TerminalHistoryProps> = ({ history }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="flex-1 overflow-y-auto">
      {history.map((entry, index) => (
        <div key={index} className={`whitespace-pre-wrap ${
          entry.type === 'command' ? 'text-white' : 
          entry.type === 'error' ? 'text-red-400' : 
          'text-green-400'
        }`}>
          {entry.content}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  prompt: string;
}

const TerminalInput = React.forwardRef<HTMLSpanElement, TerminalInputProps>(
  ({ value, onChange, onSubmit, prompt }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit(value);
      }
    };

    const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
      onChange(e.currentTarget.textContent || '');
    };

    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.textContent = value;
      }
    }, [value, ref]);

    return (
      <div className="flex items-center text-white">
        <span className="text-green-400">{prompt}</span>
        <span
          ref={ref}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none flex-1"
          style={{ minWidth: '1ch' }}
          autoFocus
          suppressContentEditableWarning
        />
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';

export default Terminal;