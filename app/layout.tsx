import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from 'sonner'
import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const SITE_URL = 'https://nationalfranchiseinvestmentsummit.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'National Franchise Investment Summit | NFIS India',
    template: '%s | NFIS'
  },
  description: 'National Franchise Investment Summit (NFIS) - India\'s premier platform for franchise discovery. Secure vetted opportunities, connect with capital partners, and grow your portfolio across 600+ brands.',
  keywords: ['Franchise India', 'Investment Summit', 'Business Opportunities', 'Franchise Expo', 'NFIS', 'Capital Network', 'Franchise Growth', 'Master Franchise India'],
  authors: [{ name: 'NFIS Team' }],
  creator: 'National Franchise Investment Summit',
  publisher: 'National Franchise Investment Summit',
  alternates: {
    canonical: SITE_URL,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'National Franchise Investment Summit | Connect with 600+ Leading Brands',
    description: 'Explore vetted franchise and investment opportunities. Join India\'s premier franchise ecosystem at NFIS.',
    url: SITE_URL,
    siteName: 'National Franchise Investment Summit',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png', // Official logo as fallback OG image
        width: 800,
        height: 800,
        alt: 'NFIS - National Franchise Investment Summit',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'National Franchise Investment Summit | NFIS',
    description: 'India\'s premier platform for franchise discovery and investment.',
    creator: '@NFIS_India',
    images: ['/logo.png'],
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
        url: '/favicon/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon.ico',
      },
    ],
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'manifest',
        url: '/favicon/site.webmanifest',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Structured Data for AI Engines (Gemini/Google)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'National Franchise Investment Summit',
    'url': SITE_URL,
    'logo': `${SITE_URL}/logo.png`,
    'sameAs': [
      'https://twitter.com/NFIS_India',
      'https://www.linkedin.com/company/nfis-india'
    ],
    'description': 'India\'s premier franchise exhibition platform connecting franchisors, investors, and entrepreneurs.',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Mumbai',
      'addressRegion': 'Maharashtra',
      'addressCountry': 'India'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+91-98205-31096',
      'contactType': 'customer service',
      'email': 'info@nationalfranchiseinvestmentsummit.com.com'
    }
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'National Franchise Investment Summit',
    'url': SITE_URL,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${SITE_URL}/franchises?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en">
      <head>
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <Toaster position="top-right" expand={false} richColors />
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  )
}
