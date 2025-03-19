// app/layout.tsx
import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/shared/theme-provider'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { AuthProvider } from '@/lib/providers/auth-context'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'AGRILINK Rwanda | Agricultural E-Commerce Platform',
  description: 'Connecting farmers, buyers, and agricultural stakeholders in Rwanda through a digital marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NextTopLoader 
              color="#16a34a"
              showSpinner={false}
              shadow="0 0 10px #16a34a,0 0 5px #16a34a"
            />
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </div>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}