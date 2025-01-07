import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/theme';

export const metadata: Metadata = {
  title: 'soohoonchoi',
  description: 'soohoonchoi',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className="m-0 p-0">
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
