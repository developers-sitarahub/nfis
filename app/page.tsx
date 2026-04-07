import Home from './ClientHome';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'National Franchise Investment Summit',
  description:
    'Connect with India\'s best franchise opportunities. NFIS brings together 600+ leading brands, investors, and entrepreneurs on one powerful platform.',

  openGraph: {
    title: 'National Franchise Investment Summit',
    description:
      'Explore top franchise opportunities and connect with leading brands in India.',
    url: '/',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'National Franchise Investment Summit',
      },
    ],
  },
};


export default async function Page() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let initialFranchises: any[] = [];
  let initialExhibitions: any[] = [];

  try {
    // Fetch Franchises
    const franchiseRes = await fetch(`${API_URL}/api/exhibitor-registrations/`, {
      next: { revalidate: 30 }
    });

    if (franchiseRes.ok) {
      const data = await franchiseRes.json();
      const results = data.results || data;
      initialFranchises = (Array.isArray(results) ? results : []).slice(0, 3).map((item: any) => {
        const investmentStr = item.investment_required || '';
        const minMatch = investmentStr.split('-')[0]?.match(/([\d.]+)\s*(K|Lakh|Crore)/i);
        const maxMatch = investmentStr.split('-')[1]?.match(/([\d.]+)\s*(K|Lakh|Crore)/i);

        const parseVal = (match: any) => {
          if (!match) return 0;
          let val = parseFloat(match[1]);
          const unit = (match[2] || '').toLowerCase();
          if (unit === 'k') val *= 1000;
          else if (unit === 'lakh') val *= 100000;
          else if (unit === 'crore') val *= 10000000;
          return val;
        };

        const minInvest = parseVal(minMatch);
        const maxInvest = parseVal(maxMatch) || minInvest * 1.5;

        return {
          id: item.id.toString(),
          name: item.company_name || 'Upcoming Franchise',
          categories: (item.industry || 'General').split(/[;,]/).map((s: string) => s.trim()).filter(Boolean),
          investmentRange: { min: minInvest, max: maxInvest },
          description: item.about || '',
          shortDescription: item.product_category || '',
          roi: item.roi || '18-25',
          yearsInBusiness: Number(item.founded_year) ? new Date().getFullYear() - Number(item.founded_year) : 5,
          unitsOperating: Number(item.units_operating) || 0,
          supportLevel: 'Comprehensive',
          image: item.logo || '',
          highlights: ['Proven Model', 'Training Included', 'Brand Support'],
          verified: item.status === 'paid',
        };
      });
    }

    // Fetch Exhibitions
    const exhibitionRes = await fetch(`${API_URL}/api/events/`, {
      next: { revalidate: 30 }
    });

    if (exhibitionRes.ok) {
      const data = await exhibitionRes.json();
      if (data && data.results) {
        initialExhibitions = data.results.map((item: any) => ({
          id: item.id.toString(),
          name: item.title,
          location: item.location || item.venue || 'TBA',
          date: item.start_date,
          description: item.description || 'No description available',
          image: item.image || '',
          featured: item.is_active,
          attendees: parseInt(item.buyers_count) || undefined,
          booths: parseInt(item.exhibitors_count) || undefined,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching home data on server:', error);
  }

  return <Home initialFranchises={initialFranchises} initialExhibitions={initialExhibitions} />;
}
