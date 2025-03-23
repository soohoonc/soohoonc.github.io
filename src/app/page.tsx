import { Desktop } from '@/components/desktop';
import { OSProvider } from '@/providers/os';
import { DesktopProvider } from '@/providers/desktop';

const Page = () => {
  return (
    <main className="w-screen h-screen">
      <OSProvider>
        <DesktopProvider>
          <Desktop />
        </DesktopProvider>
      </OSProvider>
    </main>
  )
};

export default Page;
