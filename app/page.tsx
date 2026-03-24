import Home from './ClientHome';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'National Franchise Investment Summit | India\'s Premier Franchise Ecosystem',
  description: 'Connect with 600+ leading franchise brands, high-net-worth investors, and ambitious entrepreneurs at the National Franchise Investment Summit (NFIS). Attend premium exhibitions in major Indian cities.',
  openGraph: {
    title: 'National Franchise Investment Summit (NFIS) | Connect with Leading Brands',
    description: 'Explore vetted franchise and investment opportunities. Join the National Franchise Investment Summit (NFIS) community today.',
    url: '/',
    images: [
      {
        url: '/og-home.png', // Assuming user might add later
        width: 1200,
        height: 630,
        alt: 'NFIS Home - National Franchise Investment Summit',
      },
    ],
  },
};

export default function Page() {
  return <Home />;
}
