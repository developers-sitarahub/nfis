import FranchisesPage from './ClientFranchises';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Franchise Hub | Discover Premium Business Opportunities',
  description: 'Explore registered franchise brands ready for nationwide expansion. Modernize your portfolio with vetted and scalable business models.',
  openGraph: {
    title: 'Franchise Hub | Premium Investment Opportunities',
    description: 'Find your perfect franchise match. Explore 600+ brands ready to scale with you.',
    url: '/franchises',
    type: 'article',
  },
  keywords: ['Franchise Hub', 'Business Opportunities', 'Investment Portfolio', 'Scalable Models', 'Brand Expansion'],
};

export default function Page() {
  return <FranchisesPage />;
}
