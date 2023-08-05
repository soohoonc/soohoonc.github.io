import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers'
import Navbar from '@/components/Navbar'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Soohoon Choi',
  description: 'Soohoon\'s personal website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <body className={inter.className}>{children}</body>
        </ThemeProvider>
    </html>
  )
}
