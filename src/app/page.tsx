import { Desktop } from '@/components/desktop';
import { OSProvider } from '@/providers/os';


const Page = () => {
  return (
    <main className="w-screen h-screen">
      <OSProvider>
        <Desktop />
      </OSProvider>
    </main>
  )
};

export default Page;
