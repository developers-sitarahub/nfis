import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from 'sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NFIS - National Franchise Investment Summit',
  description: 'National Franchise Investment Summit (NFIS) - India\'s premier platform for franchise discovery. Secure vetted opportunities, connect with capital partners, and grow your portfolio.',
  openGraph: {
    title: 'National Franchise Investment Summit | Connect with Leading Brands',
    description: 'Explore 600+ vetted franchise and investment opportunities. Join the National Franchise Investment Summit (NFIS) community today.',
    url: 'https://nfis.example.com',
    siteName: 'National Franchise Investment Summit',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <Toaster position="top-right" expand={false} richColors />
      </body>
    </html>
  )
}
