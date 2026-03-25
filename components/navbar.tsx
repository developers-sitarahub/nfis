'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    company: '',
    role: '',
  });

  useEffect(() => {
    const loadUserData = () => {
      const token = localStorage.getItem('access_token');
      const name = localStorage.getItem('user_name');
      const company = localStorage.getItem('company_name');
      const role = localStorage.getItem('user_role');

      if (token) {
        setIsLoggedIn(true);
        setUserData({
          name: name || 'User',
          company: company || '',
          role: role || '',
        });
      } else {
        setIsLoggedIn(false);
      }
    };

    // Initial load
    loadUserData();

    // Listen for custom login/logout events on the same tab
    window.addEventListener('auth-change', loadUserData);
    
    // Listen for changes from other tabs (optional but good)
    window.addEventListener('storage', loadUserData);

    return () => {
      window.removeEventListener('auth-change', loadUserData);
      window.removeEventListener('storage', loadUserData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    localStorage.removeItem('company_name');
    
    // Broadcast auth change
    window.dispatchEvent(new Event('auth-change'));
    
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    router.replace('/login');
    router.refresh();
  };

  const getDashboardLink = () => {
    if (userData.role === 'franchisor') return '/dashboard/franchisor';
    if (userData.role === 'investor') return '/dashboard/investor';
    return '/dashboard';
  };

  const links = [
    { href: '/', label: 'Home' },
    { href: '/franchises', label: 'Franchises' },
    { href: '/investors', label: 'Investors' },
    { href: '/exhibitions', label: 'Exhibitions' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 bg-white rounded-full p-1 shadow-md border border-gray-100 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:shadow-red-500/10">
              <div className="relative w-full h-full">
                <Image
                  src="/logo.png"
                  alt="NFIS Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-gray-900 text-sm leading-none tracking-tight">NFIS</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 opacity-70">National Franchise Investment Summit</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-700 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-red-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <User size={16} />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-[11px] font-bold text-gray-900 leading-none truncate max-w-[120px]">{userData.name}</p>
                    {userData.company && <p className="text-[9px] text-gray-500 font-medium truncate max-w-[120px] uppercase tracking-tighter mt-0.5">{userData.company}</p>}
                  </div>
                  <ChevronDown className={`text-gray-400 group-hover:text-blue-700 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} size={16} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl p-2 animate-in fade-in zoom-in slide-in-from-top-2 duration-300 z-[60]">
                    <div className="px-4 py-3 mb-1 border-b border-gray-50">
                      <p className="text-xs font-black text-gray-400 tracking-[0.2em] uppercase">User Session</p>
                      <p className="text-sm font-bold text-gray-900 mt-1 truncate">{userData.name}</p>
                      {userData.company && <p className="text-[11px] text-gray-500 font-medium mt-0.5">{userData.company}</p>}
                    </div>
                    
                    <div className="space-y-1">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50/50 hover:text-blue-700 rounded-xl transition-all group"
                      >
                        <LayoutDashboard size={18} className="text-gray-400 group-hover:text-blue-600" />
                        Go to Dashboard
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50/50 rounded-xl transition-all group"
                      >
                        <LogOut size={18} className="text-red-400 group-hover:text-red-600" />
                        Logout Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Sign In
                </a>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="px-3">
                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2">My Profile</p>
                  <p className="text-sm font-bold text-gray-900">{userData.name}</p>
                  {userData.company && <p className="text-xs text-gray-500 font-medium">{userData.company}</p>}
                </div>
                <Link
                  href={getDashboardLink()}
                  className="block px-3 py-2 bg-blue-50 text-blue-700 font-bold text-sm rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 bg-red-50 text-red-600 font-bold text-sm rounded-lg"
                >
                  Logout Session
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <a
                  href="/login"
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Sign In
                </a>
                <Link
                  href="/register"
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm rounded-lg transition-all text-center shadow-md"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
