import ContactPage from './ClientContact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | National Franchise Investment Summit',
  description: 'Have questions about NFIS? Get in touch with our team for exhibition bookings, partnership inquiries, or general support.',
};

export default function Page() {
  return <ContactPage />;
}
