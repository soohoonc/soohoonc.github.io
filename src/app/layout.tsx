import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/theme';
import { ShellProvider } from '@/providers/shell';

export const metadata: Metadata = {
  title: 'soohoonchoi',
  description: 'soohoonchoi',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <main>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <ShellProvider>
              {children}
            </ShellProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
