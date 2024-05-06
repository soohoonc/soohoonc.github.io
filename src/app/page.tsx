import { Terminal } from '@/components/terminal';
import { ShellProvider, TerminalStateProvider } from './providers';

export default function Home() {
  return (
    <div className='w-screen h-screen justify-center items-center'>
      <ShellProvider>
        <TerminalStateProvider>
          <Terminal />
        </TerminalStateProvider>
      </ShellProvider>
    </div>
  );
}
