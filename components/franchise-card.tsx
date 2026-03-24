'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Franchise } from '@/lib/types';
import { TrendingUp, Users, Target, ShieldCheck, Store } from 'lucide-react';

interface FranchiseCardProps {
  franchise: Franchise;
}

export function FranchiseCard({ franchise }: FranchiseCardProps) {
  const formatInvestment = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1).replace('.0', '')} Crore`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1).replace('.0', '')} Lakh`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  const formattedMinInvestment = formatInvestment(franchise.investmentRange.min);
  const formattedMaxInvestment = formatInvestment(franchise.investmentRange.max);

  return (
    <Link href={`/franchises/${franchise.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-red-300 transition-all duration-300 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
          {franchise.image ? (
            <Image
              src={franchise.image}
              alt={franchise.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
              <Store size={48} className="text-red-600/10 mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest text-red-600/30">NFIS Participant</p>
            </div>
          )}
          {franchise.verified && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white p-1 rounded-md shadow-lg border border-white/20 z-10">
              <ShieldCheck size={16} />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {franchise.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title and Description */}
          <h3 className="font-bold text-lg mb-2 text-gray-900">{franchise.name}</h3>
          {/* Description removed as requested - visible only in detail page */}

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-t border-b border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target size={14} className="text-red-600" />
              </div>
              <p className="text-xs font-semibold text-gray-900">{franchise.roi}% ROI</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users size={14} className="text-red-600" />
              </div>
              <p className="text-xs font-semibold text-gray-900">{franchise.unitsOperating}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp size={14} className="text-red-600" />
              </div>
              <p className="text-xs font-semibold text-gray-900">{franchise.yearsInBusiness}y</p>
            </div>
          </div>

          {/* Investment Range */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Investment Range</p>
            <p className="text-lg font-bold text-red-600">
              {formattedMinInvestment} - {formattedMaxInvestment}
            </p>
          </div>

          {/* Learn More Button */}
          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200">
            Learn More
          </button>
        </div>
      </div>
    </Link>
  );
}
