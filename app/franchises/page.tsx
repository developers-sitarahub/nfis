'use client';

import { useState, useEffect } from 'react';
import { FranchiseCard } from '@/components/franchise-card';
import { Franchise } from '@/lib/types';
import { Search, Filter, RefreshCw, Briefcase } from 'lucide-react';

export default function FranchisesPage() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minInvestment, setMinInvestment] = useState(0);
  const [maxInvestment, setMaxInvestment] = useState(10000000);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchFranchises = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/exhibitor-registrations/`);
        if (res.ok) {
          const data = await res.json();
          const results = data.results || data;

          const mapped: Franchise[] = (Array.isArray(results) ? results : []).map((item: any) => {
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
              category: item.industry || 'General',
              investmentRange: { 
                min: minInvest, 
                max: maxInvest 
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
          setFranchises(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch franchises:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFranchises();
  }, [API_URL]);

  const categories = Array.from(new Set(franchises.map((f) => f.category)));

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const filtered = franchises.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(brand.category);

    const matchesInvestment =
      brand.investmentRange.min >= minInvestment &&
      brand.investmentRange.min <= maxInvestment;

    return matchesSearch && matchesCategory && matchesInvestment;
  });

  if (loading) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
           <RefreshCw className="animate-spin text-red-600 mb-6" size={48} />
           <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">Accessing Franchise Network...</p>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">Franchise Hub</h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
               Discover {franchises.length} registered brands ready for nationwide expansion.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl">
             <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Briefcase size={28}/></div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Reach</p>
                <p className="text-sm font-black text-gray-900 uppercase">ACTIVE BRANDS</p>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Filtering Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-2xl sticky top-24">
              <h3 className="text-xl font-bold mb-8 text-gray-900 flex items-center gap-2">
                 <Filter size={18} className="text-red-500" /> Filter Brands
              </h3>

              <div className="space-y-8">
                {/* Search */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-4 block text-gray-400">Brand Name</label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
                    <input
                      placeholder="e.g. Cafe, Retail..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50/70 border-2 border-transparent rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 block text-gray-400">Categories</h4>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleCategory(category)}>
                          <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedCategories.includes(category) ? "bg-red-600 border-red-600" : "bg-white border-gray-200 group-hover:border-red-400"}`}>
                             {selectedCategories.includes(category) && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                          </div>
                          <label className={`text-sm font-bold tracking-tight transition-colors ${selectedCategories.includes(category) ? "text-red-700" : "text-gray-600 group-hover:text-red-600"}`}>
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investment Range */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 block text-gray-400">Min Investment</h4>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="100000"
                    value={minInvestment}
                    onChange={(e) => setMinInvestment(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <span>₹0</span>
                     <span>Current: ₹{(minInvestment / 100000).toFixed(1)}L</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategories([]);
                    setMinInvestment(0);
                    setMaxInvestment(10000000);
                  }}
                  className="w-full py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-10">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                 Showing <span className="text-gray-900">{filtered.length} Active Opportunities</span>
               </p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-10">
                {filtered.map((franchise) => (
                  <FranchiseCard key={franchise.id} franchise={franchise} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] border border-gray-100 p-24 text-center shadow-xl">
                 <Search size={64} className="mx-auto text-gray-200 mb-6" />
                 <h3 className="text-2xl font-black text-gray-900 mb-2">No Brands Match</h3>
                 <p className="text-gray-500 font-medium mb-8 max-w-xs mx-auto">Try adjusting your budget or category filters to see more active networks.</p>
                 <button onClick={() => { setSearchQuery(''); setSelectedCategories([]); setMinInvestment(0); }} className="px-8 py-3 bg-gray-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-black transition-all">Clear Search</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
