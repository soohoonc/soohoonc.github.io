import { Desktop } from '@/components/Desktop';
import { WasmProvider } from '@/providers/os';


const Page = () => {
  return (
    <main className="w-screen h-screen">
      <WasmProvider>
        <Desktop />
      </WasmProvider>
    </main>
  )
};

export default Page;
