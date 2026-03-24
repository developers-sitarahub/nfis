'use client';

import { Investor } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Briefcase, IndianRupee, ShieldCheck, User } from 'lucide-react';

interface InvestorCardProps {
  investor: Investor;
}

export function InvestorCard({ investor }: InvestorCardProps) {
  return (
    <Link href={`/investors/${investor.id}`}>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="p-8 flex flex-col h-full">
        <div className="flex items-start gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-50 flex-shrink-0 bg-gray-50 flex items-center justify-center">
            {investor.image ? (
              <Image 
                src={investor.image} 
                alt={investor.name} 
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-blue-50/50">
                <User size={32} className="text-blue-600/30" />
              </div>
            )}
            {investor.verified && (
              <div className="absolute -right-1 -top-1 bg-blue-600 text-white p-1 rounded-bl-xl shadow-md border-b-2 border-l-2 border-white z-10">
                <ShieldCheck size={14} />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-blue-700 transition-colors tracking-tight line-clamp-1">
                {investor.firmName || investor.name}
              </h3>
            </div>
            {investor.firmName && (
              <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-tight truncate">{investor.name}</p>
            )}
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <MapPin size={14} className="text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest">{investor.location}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {investor.preferredIndustries.slice(0, 2).map((ind) => (
                <span key={ind} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-tighter">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
           <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <IndianRupee size={10} /> Capacity
              </p>
              <p className="text-sm font-black text-gray-900 tracking-tight">{investor.investmentCapacity}</p>
           </div>
           <div className="space-y-1 text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-end gap-1">
                <Briefcase size={10} /> Profile
              </p>
              <p className="text-sm font-bold text-gray-700 tracking-tight">{investor.experience}</p>
           </div>
        </div>

        {/* Description removed as requested - visible only in detail page */}

        <div className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-gray-900/10 hover:shadow-gray-900/30 hover:bg-black transition-all active:scale-[0.98] text-center">
           View Full Profile
        </div>
      </div>
      </div>
    </Link>
  );
}
