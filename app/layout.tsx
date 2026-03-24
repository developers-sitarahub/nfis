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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'National Franchise Investment Summit | NFIS India',
    template: '%s | NFIS'
  },
  description: 'National Franchise Investment Summit (NFIS) - India\'s premier platform for franchise discovery. Secure vetted opportunities, connect with capital partners, and grow your portfolio across 600+ brands.',
  keywords: ['Franchise India', 'Investment Summit', 'Business Opportunities', 'Franchise Expo', 'NFIS', 'Capital Network', 'Franchise Growth'],
  authors: [{ name: 'NFIS Team' }],
  creator: 'National Franchise Investment Summit',
  publisher: 'National Franchise Investment Summit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'National Franchise Investment Summit | Connect with 600+ Leading Brands',
    description: 'Explore vetted franchise and investment opportunities. Join India\'s premier franchise ecosystem at NFIS.',
    url: '/',
    siteName: 'National Franchise Investment Summit',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'National Franchise Investment Summit | NFIS',
    description: 'India\'s premier platform for franchise discovery and investment.',
    creator: '@NFIS_India',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
