'use client';

import React, { useEffect, useState } from 'react';
import init, { OSHandle } from '@/os/pkg';

interface Process {
  pid: number;
  name: string;
  state: string;
}

export const Desktop = () => {
  const [os, setOs] = useState<OSHandle | null>(null);
  const [processes, setProcesses] = useState<string[]>([]);
  const [terminal, setTerminal] = useState<string[]>([]);

  useEffect(() => {
    async function initOS() {
      await init();
      const osHandle = new OSHandle();
      setOs(osHandle);
      
      // Create some initial processes
      osHandle.create_process("shell", 1);
      osHandle.create_process("init", 1);
      
      // Create some files
      osHandle.create_file("/welcome.txt", "Welcome to WasmOS!");
      
      // Start scheduler
      setInterval(() => {
        osHandle.schedule();
        updateProcessList();
      }, 1000);
    }

    initOS();
  }, []);

  const updateProcessList = () => {
    if (os) {
      const processList = os.get_process_list();
      setProcesses(processList);
    }
  };

  const handleCommand = async (cmd: string) => {
    if (!os) return;

    const [command, ...args] = cmd.split(' ');
    
    switch (command) {
      case 'ls':
        try {
          // Implement directory listing
          setTerminal(prev => [...prev, '> ' + cmd, 'welcome.txt']);
        } catch (error) {
          setTerminal(prev => [...prev, '> ' + cmd, 'Error: ' + error]);
        }
        break;
      
      case 'cat':
        try {
          const content = await os.read_file(args[0]);
          setTerminal(prev => [...prev, '> ' + cmd, content]);
        } catch (error) {
          setTerminal(prev => [...prev, '> ' + cmd, 'Error: ' + error]);
        }
        break;

      case 'ps':
        updateProcessList();
        setTerminal(prev => [...prev, '> ' + cmd, ...processes]);
        break;

      default:
        setTerminal(prev => [...prev, '> ' + cmd, 'Command not found']);
    }
  };

  return (
    <div className="desktop">
      <div className="window process-list">
        <h2>Processes</h2>
        <ul>
          {processes.map((process, i) => (
            <li key={i}>{process}</li>
          ))}
        </ul>
      </div>

      <div className="window terminal">
        <h2>Terminal</h2>
        <div className="terminal-output">
          {terminal.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
    </div>
  );
}

