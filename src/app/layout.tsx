import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '../components/providers/SessionProvider'
import { StoreProvider } from '../components/providers/StoreProvider'
import { ErrorBoundary } from '../components/common'
import { Toaster } from '../components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MMG Vehicle Inventory Tool',
  description: 'Mark Motors Group Vehicle Inventory Management System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <SessionProvider>
            <StoreProvider>
              {children}
            </StoreProvider>
          </SessionProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  )
}
