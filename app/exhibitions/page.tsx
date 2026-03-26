import ExhibitionsPage from './ClientExhibitions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Franchise Exhibitions & Events | Connecting Leaders across India',
  description: 'Join premier franchise exhibitions and summits in 15+ locations. Experience India\'s most strategic business events.',
  alternates: {
    canonical: 'https://nationalfranchiseinvestmentsummit.com/exhibitions',
  },
  openGraph: {
    title: 'Exhibitions Hub | Premier Business Networking',
    description: 'Explore upcoming franchise events and maximize your networking opportunities.',
    url: 'https://nationalfranchiseinvestmentsummit.com/exhibitions', // Use full URL
    type: 'website',
  },
  keywords: ['Franchise Expo', 'Business Summits', 'Networking Events', 'Exhibitions India'],
};

export default function Page() {
  return <ExhibitionsPage />;
}
