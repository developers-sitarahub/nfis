"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Users, Building, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { authFetch } from "@/lib/authFetch";
import { Share2, X, Mail, Send } from "lucide-react";

export default function ExecutiveDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Executive");

  useEffect(() => {
    // Check role, ensure it's executive
    const role = localStorage.getItem("user_role");
    if (!role || role !== "executive") {
      router.push("/login");
      return;
    }
    const name = localStorage.getItem("user_name");
    if (name) setUserName(name);
  }, [router]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"franchisor" | "investor">("franchisor");
  const [targetEmail, setTargetEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    router.push("/login");
  };

  const openShareModal = (type: "franchisor" | "investor") => {
    setModalType(type);
    setTargetEmail("");
    setIsModalOpen(true);
  };

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.includes('@')) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    setIsSending(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await authFetch(`${API_URL}/api/secure-form/generate/`, {
        method: 'POST',
        body: JSON.stringify({
          email: targetEmail,
          form_type: modalType
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        toast.success("Secure invite sent successfully!");
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        toast.error(err.detail || "Failed to generate secure link.");
      }
    } catch (error) {
      toast.error("Connection failure. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              NX
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">NFIS Executive</h1>
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Internal Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-600 hidden sm:block">
              Welcome, <span className="font-bold text-gray-900">{userName}</span>
            </span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 py-16">
          <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
              <ShieldCheck size={14} className="text-indigo-300" />
              Secure Access
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
              Executive Dashboard
            </h2>
            <p className="text-indigo-200 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
              Manage internal data, onboard premium franchisors, and list highly qualified investors directly into the platform pipeline.
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Add Franchisor */}
          <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative overflow-hidden flex flex-col">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
             
             <div className="relative z-10 p-8 flex flex-col flex-1">
               <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                 <Building size={28} />
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-3">Franchisor Onboarding</h3>
               <p className="text-gray-500 font-medium mb-8 flex-1">
                 Add a new verified franchise profile directly, or generate a 1-hour secure self-fill link for remote brands.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                 <Link href="/executive/franchise/add" className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 text-sm uppercase tracking-wider">
                   <Plus size={18} /> Onboard Directly
                 </Link>
                 <button onClick={() => openShareModal("franchisor")} className="flex items-center justify-center gap-2 bg-white border border-indigo-200 text-indigo-600 font-bold px-5 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm uppercase tracking-wider">
                   <Share2 size={16} /> Share Link
                 </button>
               </div>
             </div>
          </div>

          {/* Add Investor */}
          <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 relative overflow-hidden flex flex-col">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
             
             <div className="relative z-10 p-8 flex flex-col flex-1">
               <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                 <Users size={28} />
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-3">Investor Leads</h3>
               <p className="text-gray-500 font-medium mb-8 flex-1">
                 Register an investor into the pipeline yourself, or dispatch a secure one-time setup form directly to their email.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                 <Link href="/executive/investors/add" className="flex items-center justify-center gap-2 flex-1 bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 text-sm uppercase tracking-wider">
                   <Plus size={18} /> Register Lead
                 </Link>
                 <button onClick={() => openShareModal("investor")} className="flex items-center justify-center gap-2 bg-white border border-emerald-200 text-emerald-600 font-bold px-5 py-3 rounded-xl hover:bg-emerald-50 transition-colors text-sm uppercase tracking-wider">
                   <Share2 size={16} /> Share Link
                 </button>
               </div>
             </div>
          </div>

        </div>
      </main>

      {/* Share Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
            <div className={`p-6 text-white flex items-center justify-between ${modalType === "franchisor" ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
              <div className="flex items-center gap-3">
                <Share2 size={20} />
                <h3 className="text-lg font-black uppercase tracking-wider">Secure Form Link</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleGenerateLink} className="p-8">
              <div className="mb-6">
                <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                  This generates an <strong>encrypted, single-recipient form link</strong> tied to the email address. It expires strictly in <strong>24 hours</strong>.
                </p>
                
                <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 mb-5 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Type</span>
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${modalType === "franchisor" ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {modalType}
                  </span>
                </div>

                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Recipient Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="email"
                    placeholder="partner@example.com"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-semibold transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3 font-bold text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={isSending}
                  type="submit" 
                  className={`flex-[2] py-3.5 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${
                    modalType === "franchisor" 
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' 
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  {isSending ? 'Generating...' : <><Send size={14} /> Generate & Send</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
