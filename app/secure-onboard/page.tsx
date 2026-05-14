'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Lock, Loader2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import FranchisorAddFormSecure from './FranchisorForm';
import InvestorAddFormSecure from './InvestorForm';

function SecureOnboardingContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [tokenData, setTokenData] = useState<{ email: string; form_type: string } | null>(null);

  useEffect(() => {
    const t = searchParams.get('token');
    if (!t) {
      setLoading(false);
      setError('No authorization token provided.');
      return;
    }
    setToken(t);
    initTokenVerification(t);
  }, [searchParams]);

  // Initial Ping: validates token directly without OTP
  const initTokenVerification = async (secureToken: string) => {
    setLoading(true);
    setError('');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/secure-form/verify/?token=${encodeURIComponent(secureToken)}`);
      const data = await res.json();

      if (res.ok && data.valid) {
         setTokenData({ email: data.email, form_type: data.form_type });
         setIsValid(true);
      } else {
        setError(data.detail || 'Link validation failed.');
      }
    } catch (err) {
      setError('Could not connect to the security service.');
    } finally {
      setLoading(false);
    }
  };

  // Case 1: Hard loading initial gate
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="animate-pulse flex flex-col items-center">
           <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
             <ShieldCheck className="w-8 h-8 text-indigo-600" />
           </div>
           <h2 className="text-xl font-black text-slate-800">Establishing Security Gate...</h2>
           <p className="text-slate-500 mt-2 text-sm">Analyzing cryptographic signature.</p>
        </div>
      </div>
    );
  }

  // Case 2: Access Denied Error Screen
  if (error && !isValid) {
    const isAlreadyFilled = error.toLowerCase().includes('already completed');
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className={`bg-white max-w-md w-full rounded-[2rem] p-10 shadow-2xl border text-center transform animate-in slide-in-from-bottom-4 duration-500 ${isAlreadyFilled ? 'border-emerald-50' : 'border-red-50'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isAlreadyFilled ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {isAlreadyFilled ? (
              <ShieldCheck className="text-emerald-600 w-10 h-10" />
            ) : (
              <AlertCircle className="text-red-500 w-10 h-10" />
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
            {isAlreadyFilled ? 'Form Already Filled' : 'Access Blocked'}
          </h2>
          <p className="text-slate-600 font-medium mb-8 leading-relaxed">{error}</p>
          <button 
            onClick={() => router.push(isAlreadyFilled ? '/login' : '/')} 
            className="w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
          >
            {isAlreadyFilled ? 'Login to NFIS' : 'Return to Gateway'}
          </button>
        </div>
      </div>
    );
  }

  // Case 4: Success Screen -> LOAD FORMS!
  if (isValid && tokenData) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 animate-in fade-in duration-700">
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm">
            <Lock size={14} className="shrink-0" />
            Verified Session unlocked for {tokenData.email}
          </div>
        </div>

        <div className="animate-in slide-in-from-bottom-8 duration-500">
          {tokenData.form_type === 'franchisor' ? (
            <FranchisorAddFormSecure initialEmail={tokenData.email} secureToken={token} />
          ) : (
            <InvestorAddFormSecure initialEmail={tokenData.email} secureToken={token} />
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default function SecureOnboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin w-10 h-10 text-indigo-600" /></div>}>
      <SecureOnboardingContainer />
    </Suspense>
  );
}
