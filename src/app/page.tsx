import { ShellProvider, TerminalStateProvider } from "./providers"
import { Terminal } from '@/components/terminal'

const TerminalPage = () => {
  return (
    <div className='w-screen h-screen justify-center items-center'>
      <ShellProvider>
        <TerminalStateProvider>
          <Terminal />
        </TerminalStateProvider>
      </ShellProvider>
    </div>
  )
}

export default TerminalPage