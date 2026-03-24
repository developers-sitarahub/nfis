'use client';

import { useState, useEffect, useCallback } from 'react';
import { InvestorCard } from '@/components/investor-card';
import { Investor } from '@/lib/types';
import { Search, Filter, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchInvestors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch without authentication, as per user requirement (matching franchisor style)
      const res = await fetch(`${API_URL}/api/investor-registrations/`);
      
      if (res.ok) {
        const data = await res.json();
        const results = data.results || (Array.isArray(data) ? data : []);
        
        const mapped: Investor[] = results.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: item.full_name || item.firm_name || 'Strategic Investor',
          location: item.preferred_location || 'Pan India',
          investmentCapacity: item.investment_budget || 'Confidential',
          preferredIndustries: (item.interested_sector || '').split(',').map((s: string) => s.trim()).filter(Boolean),
          experience: item.business_experience || 'Industry Professional',
          description: item.about || '',
          image: item.logo || '',
          verified: item.status === 'converted' || item.status === 'paid',
          firmName: item.firm_name,
          email: item.email,
          phone_number: item.phone_number
        }));
        setInvestors(mapped);
      } else {
        const errText = await res.text();
        console.error('API Error:', errText);
        setError(`Access Restriction: ${res.status}`);
      }
    } catch (err) {
      console.error('Fetch exception:', err);
      setError('Connection to capital network lost.');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors]);

  const allIndustries = Array.from(new Set(investors.flatMap((i) => i.preferredIndustries)));

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const filtered = investors.filter((investor) => {
    const matchesSearch =
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (investor.description && investor.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (investor.firmName && investor.firmName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIndustry =
      selectedIndustries.length === 0 || 
      investor.preferredIndustries.some(ind => selectedIndustries.includes(ind));

    const matchesVerified = !isVerifiedOnly || investor.verified;

    return matchesSearch && matchesIndustry && matchesVerified;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <RefreshCw className="animate-spin text-blue-600 mb-6" size={48} />
        <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">Accessing Private Equity Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">Capital Network</h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Vetted high-net-worth investors and venture capitalists actively seeking franchise opportunities.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ShieldCheck size={28}/></div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Network</p>
                <p className="text-sm font-black text-gray-900 uppercase">ACTIVE INVESTORS</p>
             </div>
          </div>
        </div>

        {error ? (
          <div className="bg-white rounded-[3rem] border border-red-100 p-20 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <AlertTriangle size={40} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tight">Sync Error</h3>
            <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">{error}</p>
            <button onClick={fetchInvestors} className="px-12 py-5 bg-gray-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-black transition-all">Retry</button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-2xl sticky top-24">
                <h3 className="text-xl font-bold mb-8 text-gray-900 flex items-center gap-2">
                   <Filter size={18} className="text-blue-500" /> Filter Criteria
                </h3>

                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-4 block text-gray-400">Search Profile</label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                      <input
                        placeholder="Name or Category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50/70 border-2 border-transparent rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  {allIndustries.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 block text-gray-400">Target Categories</h4>
                      <div className="space-y-3">
                        {allIndustries.map((ind) => (
                          <div key={ind} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleIndustry(ind)}>
                            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedIndustries.includes(ind) ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200 group-hover:border-blue-400"}`}>
                               {selectedIndustries.includes(ind) && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                            </div>
                            <label className={`text-sm font-bold tracking-tight transition-colors ${selectedIndustries.includes(ind) ? "text-blue-700" : "text-gray-600 group-hover:text-blue-600"}`}>
                              {ind}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIndustries([]);
                    }}
                    className="w-full py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-10 flex items-center justify-between">
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                   Displaying <span className="text-gray-900">{filtered.length} Active Investors</span>
                 </p>
              </div>

              {filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {filtered.map((investor) => (
                    <InvestorCard key={investor.id} investor={investor} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] border border-gray-100 p-24 text-center shadow-xl">
                  <Search size={64} className="mx-auto text-gray-200 mb-6" />
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Network Quiet</h3>
                  <p className="text-gray-500 font-medium mb-8 max-w-xs mx-auto">No investors match your current filter. Try broadening your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
