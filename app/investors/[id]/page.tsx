import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Briefcase, IndianRupee, ShieldCheck, CheckCircle, Users } from 'lucide-react';
import { notFound } from 'next/navigation';

interface InvestorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvestorDetailPage({ params }: InvestorDetailPageProps) {
  const { id } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let item = null;
  
  try {
    const res = await fetch(`${API_URL}/api/investor-registrations/${id}/`, { next: { revalidate: 60 } });
    if (res.ok) {
      item = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch investor detail", err);
  }

  if (!item) {
    notFound();
  }

  const investor = {
    id: item.id.toString(),
    name: item.full_name || item.firm_name || 'Strategic Investor',
    firmName: item.firm_name,
    location: item.location || 'Pan India',
    investmentCapacity: item.investment_budget || item.investment_capacity || 'Not Specified',
    preferredIndustries: (item.interested_sector || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    experience: item.business_experience || 'Industry Professional',
    companiesFinanced: item.companies_financed || '0',
    about: item.about || '',
    image: item.logo || '',
    verified: item.status === 'converted',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/investors" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-600 mb-8 font-bold">
          <ArrowLeft size={20} />
          Back to Capital Network
        </Link>

        {/* Header Header */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-8 shadow-xl">
          <div className="relative w-full h-80 overflow-hidden bg-gray-50 flex items-center justify-center">
            {investor.image ? (
              <Image
                src={investor.image}
                alt={investor.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-blue-100">
                <User size={100} className="text-blue-600/10 mb-4" />
                <p className="text-sm font-black uppercase tracking-[0.4em] text-blue-600/20">NFIS Investor</p>
              </div>
            )}
            
            {investor.verified && (
              <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-1.5 rounded-xl shadow-2xl border-2 border-white/20 z-10 flex items-center gap-2">
                <ShieldCheck size={18} />
                <span className="text-xs font-black uppercase tracking-widest text-white">Verified Principal</span>
              </div>
            )}
          </div>

          <div className="p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                 <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                    {investor.firmName || investor.name}
                 </h1>
                 {investor.firmName && (
                   <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">{investor.name}</p>
                 )}
                 <div className="flex items-center gap-4 text-gray-500">
                   <div className="flex items-center gap-2">
                     <MapPin size={18} className="text-blue-600" />
                     <span className="text-sm font-bold uppercase tracking-widest">{investor.location}</span>
                   </div>
                 </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {investor.preferredIndustries.map((ind: string) => (
                  <span key={ind} className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-black rounded-xl border border-blue-100 uppercase tracking-tighter shadow-sm">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
             {/* Key Metrics */}
             <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl">
                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Investment Profile
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                         <IndianRupee className="text-blue-700" size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Portfolio Capacity</p>
                         <p className="text-lg font-black text-gray-900 tracking-tight">{investor.investmentCapacity}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                         <Briefcase className="text-blue-700" size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Strategic Experience</p>
                         <p className="text-lg font-black text-gray-900 tracking-tight">{investor.experience} Years</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                         <Users className="text-blue-700" size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Portfolio Companies</p>
                         <p className="text-lg font-black text-gray-900 tracking-tight">{investor.companiesFinanced}</p>
                      </div>
                   </div>
                </div>
             </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl">
                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Executive Summary
                </h3>
                <div className="prose prose-blue max-w-none">
                   <div className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                      {investor.about || "This principal investor is currently exploring premium franchise opportunities in their preferred sectors. Please request an introduction for more details on their strategic investment philosophy and deployment timeline."}
                   </div>
                </div>
              </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
             <div className="rounded-3xl border border-gray-100 bg-gray-900 p-10 shadow-2xl sticky top-24 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <h3 className="text-2xl font-black tracking-tight mb-4 relative z-10">Expand Your Network</h3>
                <p className="text-sm text-gray-400 mb-8 relative z-10 font-bold">Connect directly with this principal investor to discuss strategic partnership opportunities.</p>
                
                <div className="space-y-4 relative z-10">
                   <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                     Request Introduction
                   </button>
                   <Link href="/contact" className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-white/10">
                     Support Inquiries
                   </Link>
                </div>
                
                <div className="mt-10 pt-10 border-t border-white/10 relative z-10">
                   <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Network Highlights</h4>
                   <div className="space-y-6">
                      <div className="flex items-start gap-3">
                         <CheckCircle className="text-blue-500 flex-shrink-0" size={18} />
                         <p className="text-xs font-bold text-gray-300">Verified Direct High Net Worth Principal</p>
                      </div>
                      <div className="flex items-start gap-3">
                         <CheckCircle className="text-blue-500 flex-shrink-0" size={18} />
                         <p className="text-xs font-bold text-gray-300">Targeting Priority Scalable Models</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
