"use client";

import { useState } from "react";
import { X, CheckCircle2, ChevronDown } from "lucide-react";

interface RequestInfoButtonProps {
  franchiseName?: string;
  investorName?: string;
  className?: string;
  buttonText?: string;
}

export default function RequestInfoButton({ 
  franchiseName, 
  investorName, 
  className,
  buttonText = "Request Information" 
}: RequestInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    business_type: "",
    investment_capacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const targetName = franchiseName || investorName || "Unknown";
      const targetType = investorName ? "Investor" : "Franchise";
      
      const payload = {
        ...formData,
        message: `Requested ${targetType} Information for: ${targetName}`,
        source_platform: "NFIS",
        is_email_verified: false,
        is_phone_verified: false,
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to submit request.");
      }
    } catch (err: any) {
      setError("An error occurred while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
        setSubmitted(false);
        setFormData({
            full_name: "",
            email: "",
            phone_number: "",
            business_type: "",
            investment_capacity: "",
        });
        setError("");
    }, 300);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={className || "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#004282] text-white shadow hover:bg-[#004282]/90 h-10 px-4 py-2 w-full"}
      >
        {buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h3>
                  <p className="text-gray-600 mb-6">
                    Your request for information about <b>{franchiseName || investorName}</b> has been received. Our team will contact you shortly.
                  </p>
                  <button
                    onClick={closeModal}
                    className="bg-[#004282] text-white px-6 py-2 rounded-md hover:bg-[#004282]/90 font-medium transition"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b8eaa] focus:border-[#6b8eaa] transition text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b8eaa] focus:border-[#6b8eaa] transition text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="+91 98205 31096"
                      required
                      className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b8eaa] focus:border-[#6b8eaa] transition text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type (Optional)
                    </label>
                    <div className="relative">
                      <select
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleChange}
                        className="appearance-none w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b8eaa] focus:border-[#6b8eaa] transition bg-white text-gray-900"
                      >
                        <option value="">Select a business type</option>
                        <option value="Proprietorship">Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Private Limited">Private Limited</option>
                        <option value="LLP">LLP</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Capacity (Optional)
                    </label>
                    <div className="relative">
                      <select
                        name="investment_capacity"
                        value={formData.investment_capacity}
                        onChange={handleChange}
                        className="appearance-none w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6b8eaa] focus:border-[#6b8eaa] transition bg-white text-gray-900"
                      >
                        <option value="">Select investment range</option>
                        <option value="Up to ₹25 Lakhs">Up to ₹25 Lakhs</option>
                        <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                        <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                        <option value="₹1 Crore - ₹2.5 Crores">₹1 Crore - ₹2.5 Crores</option>
                        <option value="₹2.5 Crores - ₹5 Crores">₹2.5 Crores - ₹5 Crores</option>
                        <option value="₹5 Crores+">₹5 Crores+</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#6b8eaa] hover:bg-[#5b7a95] text-white font-semibold py-3 rounded-md shadow-sm transition disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
