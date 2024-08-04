import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers';

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
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
