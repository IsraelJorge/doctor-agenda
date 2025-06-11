import '@/styles/globals.css'

import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { Toaster } from '@/components/ui/sonner'
import { ReactQueryProvider } from '@/providers/react-query'

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'Doutor Agenda',
  icons: '/logo-icon.svg',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} antialiased`}>
        <NuqsAdapter>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NuqsAdapter>
        <Toaster richColors position="top-right" theme="light" />
      </body>
    </html>
  )
}
