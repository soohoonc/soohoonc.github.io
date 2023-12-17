import { Terminal } from '@/components/terminal';
import { FileSystemProvider, TerminalStateProvider } from './providers';

export default function Home() {
  return (
    <div className='w-screen h-screen justify-center items-center'>
      <FileSystemProvider>
        <TerminalStateProvider>
          <Terminal />
        </TerminalStateProvider>
      </FileSystemProvider>
    </div>
  );
}
