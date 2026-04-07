'use client';

import { useState, useEffect, useMemo } from 'react';
import { FranchiseCard } from '@/components/franchise-card';
import { Franchise } from '@/lib/types';
import { Search, Filter, Briefcase, ChevronDown, Check, X, ShieldCheck, ArrowUpDown, TrendingUp, Users, RefreshCw, Zap } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import * as Select from '@radix-ui/react-select';
import LoadingScreen from '@/components/loading-screen';

type SortOption = 'relevance' | 'investment-asc' | 'investment-desc' | 'roi-desc' | 'units-desc';

export default function FranchisesPage({ initialFranchises = [] }: { initialFranchises?: Franchise[] }) {
  const [franchises, setFranchises] = useState<Franchise[]>(initialFranchises);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [investmentRange, setInvestmentRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchFranchises = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/exhibitor-registrations-proxy');
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
            let maxInvest = parseVal(maxMatch);

            if (minInvest > 0 && maxInvest === 0) {
              maxInvest = minInvest;
            }

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
          setFranchises(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch franchises:', err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchFranchises();

    // Enable periodic polling every 30 seconds
    const pollInterval = setInterval(fetchFranchises, 30000);

    return () => clearInterval(pollInterval);
  }, [API_URL]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    franchises.forEach(f => {
      f.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [franchises]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const filteredAndSorted = useMemo(() => {
    let result = franchises.filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        brand.categories.some(cat => selectedCategories.includes(cat));

      const matchesInvestment =
        brand.investmentRange.min >= investmentRange[0] &&
        brand.investmentRange.min <= investmentRange[1];

      const matchesVerified = !verifiedOnly || brand.verified;

      return matchesSearch && matchesCategory && matchesInvestment && matchesVerified;
    });

    // Sorting
    switch (sortBy) {
      case 'investment-asc':
        result.sort((a, b) => a.investmentRange.min - b.investmentRange.min);
        break;
      case 'investment-desc':
        result.sort((a, b) => b.investmentRange.min - a.investmentRange.min);
        break;
      case 'roi-desc':
        result.sort((a, b) => {
          const getRoi = (r: string | number) => {
            if (typeof r === 'number') return r;
            const match = r.match(/(\d+)/);
            return match ? parseInt(match[0]) : 0;
          };
          return getRoi(b.roi) - getRoi(a.roi);
        });
        break;
      case 'units-desc':
        result.sort((a, b) => b.unitsOperating - a.unitsOperating);
        break;
      default:
        // relevance - keeps original order which might be based on creation date from API
        break;
    }

    return result;
  }, [franchises, searchQuery, selectedCategories, investmentRange, sortBy, verifiedOnly]);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setInvestmentRange([0, 10000000]);
    setSortBy('relevance');
    setVerifiedOnly(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">Franchise Hub</h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Discover {franchises.length} premium brands ready to scale with your investment.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl transition-transform hover:scale-105">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Briefcase size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Network</p>
              <p className="text-sm font-black text-gray-900 uppercase">{franchises.length} ACTIVE BRANDS</p>
            </div>
          </div>
        </div>

        {loading && <LoadingScreen />}

        {franchises.length === 0 && !loading ? (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-24 text-center shadow-xl max-w-3xl mx-auto mt-12 mb-24">
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Currently Onboarding.</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed text-lg">
              Please come back after sometime.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Filtering Sidebar */}
            <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-2xl sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={18} className="text-red-500" /> Filter Hub
                </h3>
                {(searchQuery || selectedCategories.length > 0 || investmentRange[0] > 0 || investmentRange[1] < 10000000 || verifiedOnly || sortBy !== 'relevance') && (
                  <button onClick={resetFilters} className="text-[10px] font-black uppercase text-red-600 hover:underline">Clear All</button>
                )}
              </div>

              <div className="space-y-10">
                {/* Search */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-gray-400">Search Brand</label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                    <input
                      placeholder="e.g. Cafe, Retail..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-10 py-3.5 bg-gray-50/70 border-2 border-transparent rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-semibold text-sm"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-4 text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-gray-400">Sort By</label>
                  <Select.Root value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                    <Select.Trigger
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/70 border-2 border-transparent rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold text-sm text-gray-700 group hover:bg-gray-100/80"
                    >
                      <Select.Value placeholder="Select sorting..." />
                      <Select.Icon>
                        <ChevronDown className="text-gray-400 group-hover:text-red-500 transition-colors" size={16} />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content
                        className="overflow-hidden bg-white/95 backdrop-blur-xl rounded-[1.5rem] border border-gray-100 shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200"
                        position="popper"
                        sideOffset={8}
                      >
                        <Select.Viewport className="p-2 space-y-1 min-w-[200px]">
                          {[
                            { value: 'relevance', label: 'Relevance', icon: ArrowUpDown },
                            { value: 'investment-asc', label: 'Investment: Low to High', icon: TrendingUp },
                            { value: 'investment-desc', label: 'Investment: High to Low', icon: TrendingUp },
                            { value: 'roi-desc', label: 'Highest ROI', icon: Zap },
                            { value: 'units-desc', label: 'Most Units Operating', icon: Users },
                          ].map((option) => (
                            <Select.Item
                              key={option.value}
                              value={option.value}
                              className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 outline-none cursor-pointer group transition-all relative"
                            >
                              <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-red-100 transition-colors">
                                <option.icon size={14} className="group-hover:text-red-600" />
                              </div>
                              <Select.ItemText>{option.label}</Select.ItemText>
                              <Select.ItemIndicator className="ml-auto">
                                <Check size={14} className="text-red-600" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                {/* Verified Toggle */}
                <div
                  className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${verifiedOnly ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}>
                      <ShieldCheck size={18} />
                    </div>
                    <span className="text-sm font-bold text-blue-900">Verified Hub</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${verifiedOnly ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${verifiedOnly ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>

                {/* Investment Range */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Investment Range</label>
                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-md">
                      {formatCurrency(investmentRange[0])} — {formatCurrency(investmentRange[1])}
                    </span>
                  </div>
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={investmentRange}
                    max={10000000}
                    step={100000}
                    onValueChange={(val) => setInvestmentRange(val as [number, number])}
                  >
                    <Slider.Track className="bg-gray-100 relative grow rounded-full h-1.5">
                      <Slider.Range className="absolute bg-red-500 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-red-500 shadow-lg rounded-full hover:scale-110 focus:outline-none transition-transform cursor-grab active:cursor-grabbing" aria-label="Min" />
                    <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-red-500 shadow-lg rounded-full hover:scale-110 focus:outline-none transition-transform cursor-grab active:cursor-grabbing" aria-label="Max" />
                  </Slider.Root>
                  <div className="flex justify-between mt-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <span>₹0</span>
                    <span>₹1Cr+</span>
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 block text-gray-400">Industries ({categories.length})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {categories.map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleCategory(category)}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedCategories.includes(category) ? "bg-red-600 border-red-600" : "bg-white border-gray-200 group-hover:border-red-400"}`}>
                              {selectedCategories.includes(category) && <Check size={12} className="text-white" />}
                            </div>
                            <label className={`text-sm font-bold tracking-tight transition-colors ${selectedCategories.includes(category) ? "text-red-700" : "text-gray-600 group-hover:text-red-900"}`}>
                              {category}
                            </label>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-colors ${selectedCategories.includes(category) ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Results Found</p>
                <h2 className="text-2xl font-black text-gray-900 italic">
                  {filteredAndSorted.length} <span className="text-red-600">Opportunities</span> Match
                </h2>
              </div>

              {/* Quick Filter Pill */}
              <div className="flex flex-wrap gap-2">
                {selectedCategories.length > 0 && (
                  <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border border-red-100">
                    {selectedCategories.length} Categories <X size={12} className="cursor-pointer" onClick={() => setSelectedCategories([])} />
                  </div>
                )}
                {verifiedOnly && (
                  <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border border-blue-100">
                    Verified Only <X size={12} className="cursor-pointer" onClick={() => setVerifiedOnly(false)} />
                  </div>
                )}
                {(investmentRange[0] > 0 || investmentRange[1] < 10000000) && (
                  <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border border-orange-100">
                    Budget Filter <X size={12} className="cursor-pointer" onClick={() => setInvestmentRange([0, 10000000])} />
                  </div>
                )}
              </div>
            </div>

            {filteredAndSorted.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
                {filteredAndSorted.map((franchise) => (
                  <FranchiseCard key={franchise.id} franchise={franchise} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] border border-gray-100 p-24 text-center shadow-xl">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                  <Search size={40} className="text-gray-300" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No Franchises Found</h3>
                <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed text-lg">
                  We couldn't find any brands matching your current selection. Try broadening your budget or exploring other categories.
                </p>
                <button
                  onClick={resetFilters}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-black rounded-[2rem] uppercase tracking-widest text-xs hover:bg-black transition-all shadow-2xl hover:shadow-gray-200/50"
                >
                  Reset All Filters
                  <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={16} />
                </button>
              </div>
            )}

            {/* SEO section */}
            <div className="mt-24 p-12 bg-white rounded-[3rem] border border-gray-50 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Explore Profitable Ventures</h3>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                    <TrendingUp className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">High ROI Potential</h4>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">Vetted brands with proven business models and clear paths to profitability.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Extensive Support</h4>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">Full training and operational support provided by registered franchisors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
