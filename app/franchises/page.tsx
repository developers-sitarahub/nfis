import FranchisesPage from './ClientFranchises';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Franchise Hub | Discover Premium Business Opportunities',
  description: 'Explore registered franchise brands ready for nationwide expansion. Modernize your portfolio with vetted and scalable business models.',
  alternates: {
    canonical: 'https://nationalfranchiseinvestmentsummit.com/franchises',
  },
  openGraph: {
    title: 'Franchise Hub | Premium Investment Opportunities',
    description: 'Find your perfect franchise match.',
    url: 'https://nationalfranchiseinvestmentsummit.com/franchises', // Use full URL
    type: 'website',
  },
  keywords: ['Franchise Hub', 'Business Opportunities', 'Investment Portfolio', 'Scalable Models', 'Brand Expansion'],
};

export default function Page() {
  return <FranchisesPage />;
}
