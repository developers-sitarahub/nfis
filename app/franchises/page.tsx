import { Suspense } from 'react';
import FranchisesPage from './ClientFranchises';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Franchise Opportunities in India | Browse 600+ Brands',
  description: 'Explore the best franchise business opportunities in India. From food and retail to education and services, discover vetted and scalable business models with high ROI at National Franchise Investment Summit (NFIS).',
  alternates: {
    canonical: 'https://nationalfranchiseinvestmentsummit.com/franchises',
  },
  openGraph: {
    title: 'Top Franchise Opportunities India | National Franchise Hub',
    description: 'Find your perfect franchise match. Explore 600+ vetted brands ready for nationwide expansion.',
    url: 'https://nationalfranchiseinvestmentsummit.com/franchises',
    type: 'website',
  },
  keywords: [
    'Best Franchise Opportunities India',
    'Low Investment Franchise',
    'Food Franchise India',
    'Master Franchise Opportunities India',
    'Business for sale India',
    'Franchise brand expansion',
    'NFIS Franchise Hub',
    'Verified Franchisors India'
  ],
};

export default async function Page() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let initialFranchises: any[] = [];

  try {
    const nfisSourcePlatforms = encodeURIComponent('NFIS,nfis.in');
    const res = await fetch(`${API_URL}/api/exhibitor-registrations/?source_platform=${nfisSourcePlatforms}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (res.ok) {
      const data = await res.json();
      const results = data.results || data;

      initialFranchises = (Array.isArray(results) ? results : []).map((item: any) => {
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
        let maxInvest = parseVal(maxMatch);
        if (minInvest > 0 && maxInvest === 0) maxInvest = minInvest;

        return {
          id: item.id.toString(),
          name: item.company_name || 'Upcoming Franchise',
          categories: (item.industry || 'General').split(/[;,]/).map((s: string) => s.trim()).filter(Boolean),
          investmentRange: {
            min: minInvest,
            max: maxInvest || minInvest * 1.5
          },
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
  } catch (err) {
    console.error('Error fetching franchises on server:', err);
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <FranchisesPage initialFranchises={initialFranchises} />
    </Suspense>
  );
}
