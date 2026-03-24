'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FranchiseCard } from '@/components/franchise-card';
import { ExhibitionCard } from '@/components/exhibition-card';
import { HomepageSearchBar } from '@/components/homepage-search-bar';
import { TrendingUp, Award, Users, Target, RefreshCw } from 'lucide-react';
import { Franchise } from '@/lib/types';

export default function Home() {
  const [featuredFranchises, setFeaturedFranchises] = useState<Franchise[]>([]);
  const [loadingFranchises, setLoadingFranchises] = useState(true);
  const [apiExhibitions, setApiExhibitions] = useState<any[]>([]);
  const [loadingExhibitions, setLoadingExhibitions] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    async function fetchFranchises() {
      setLoadingFranchises(true);
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
          setFeaturedFranchises(mapped.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch franchises:', err);
      } finally {
        setLoadingFranchises(false);
      }
    }

    async function fetchEvents() {
      setLoadingExhibitions(true);
      try {
        const response = await axios.get('/api/events-proxy');
        const data = response.data;

        if (data && data.results) {
          const events = data.results.map((item: any) => ({
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
          setApiExhibitions(events);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoadingExhibitions(false);
      }
    }

    fetchFranchises();
    fetchEvents();
  }, [API_URL]);

  const featuredExhibitions = apiExhibitions.length > 0
    ? apiExhibitions.filter((e) => e.featured).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 2)
    : []; // Show empty or handle mock logic if desired

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-16 md:py-28 relative">
        <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <p className="text-sm md:text-base font-semibold text-red-200 mb-3 uppercase tracking-wide">India's Premier Franchise Ecosystem</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-balance">
              National Franchise Investment Summit
            </h1>
            <p className="text-lg md:text-xl opacity-90 text-balance max-w-3xl mx-auto">
              Connect with 500+ leading franchise brands, serious investors, and ambitious entrepreneurs. Attend our premium exhibitions across major Indian cities.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Franchises */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
              Explore Franchise Brands Exhibiting
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Top franchise brands across diverse industries will be showcasing their opportunities at our summits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8 min-h-[400px]">
            {loadingFranchises ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-20">
                <RefreshCw className="animate-spin text-red-600 mb-4" size={40} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Franchise Network...</p>
              </div>
            ) : featuredFranchises.length > 0 ? (
              featuredFranchises.map((franchise) => (
                <FranchiseCard key={franchise.id} franchise={franchise} />
              ))
            ) : (
              <div className="col-span-3 text-center py-20">
                <p className="text-gray-500">No active exhibitors found at this time.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <a
              href="/franchises"
              className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Explore All Brands
            </a>
          </div>
        </div>
      </section>

      {/* Featured Exhibitions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Upcoming Exhibitions & Events
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Connect with franchisors and industry experts at premier franchise exhibitions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {featuredExhibitions.map((exhibition) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
            ))}
          </div>

          <div className="text-center">
            <a
              href="/exhibitions"
              className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              View All Events
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center text-balance">
            Why Attend National Franchise India Summit?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'For Franchisees',
                description: 'Meet 500+ brands in one place. Compare business models, discuss terms, and find your perfect franchise match.',
              },
              {
                title: 'For Franchisors',
                description: 'Connect with qualified franchisees, expand your network, showcase your opportunity, and accelerate growth.',
              },
              {
                title: 'For Investors',
                description: 'Discover high-potential franchise brands, meet franchisors directly, and identify investment opportunities.',
              },
              {
                title: 'Expert Consultations',
                description: 'Access franchise consultants, legal experts, and industry professionals for personalized guidance.',
              },
              {
                title: 'Networking Events',
                description: 'Participate in seminars, workshops, and networking sessions with industry leaders.',
              },
              {
                title: 'Premium Experience',
                description: 'Enjoy world-class venues, professional management, and curated networking opportunities.',
              },
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="text-blue-700" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">15+</p>
              <p className="text-sm text-gray-600">Summit Locations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="text-red-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-sm text-gray-600">Brand Exhibitors</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="text-blue-700" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">50K+</p>
              <p className="text-sm text-gray-600">Annual Attendees</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="text-red-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">2000+</p>
              <p className="text-sm text-gray-600">Deals Facilitated</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 via-blue-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Ready to Transform Your Franchise Journey?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto text-balance">
            Join thousands of entrepreneurs, franchisors, and investors at the National Franchise India Summit.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_SITE_URL || 'http://localhost:3000'}/exhibition#registration-form`}
              className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              Book Exhibition Booth
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_SITE_URL || 'http://localhost:3000'}/visitors#visitor-registration`}
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Register as Visitor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
