'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  businessType: z.string().optional(),
  investmentCapacity: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const businessType = watch('businessType');
  const investmentCapacity = watch('investmentCapacity');

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form submitted:', data);
    setSubmitted(true);
    reset();
    setIsLoading(false);

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about franchise opportunities? Our team is here to help you find the perfect business match.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          {/* Contact Info Cards */}
          <div className="rounded-xl border bg-white shadow flex flex-col">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold leading-none tracking-tight">Email</h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-gray-600">Send us an email anytime</p>
              <p className="font-semibold text-foreground mt-2">info@nationalfranchiseinvestmentsummit.com.com</p>
            </div>
          </div>

          <div className="rounded-xl border bg-white shadow flex flex-col">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Phone className="text-accent" size={24} />
              </div>
              <h3 className="font-semibold leading-none tracking-tight">Phone</h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-gray-600">Call us during business hours</p>
              <p className="font-semibold text-foreground mt-2">+91 98205 31096</p>
            </div>
          </div>

          <div className="rounded-xl border bg-white shadow flex flex-col">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold leading-none tracking-tight">Address</h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-gray-600">Visit our headquarters</p>
              <p className="font-semibold text-foreground mt-2">Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-xl border bg-white shadow max-w-2xl mx-auto flex flex-col">
          <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-100">
            <h3 className="font-semibold leading-none tracking-tight text-xl">Send us a Message</h3>
          </div>
          <div className="p-6 pt-6">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold text-green-900 mb-2">Thank You!</h3>
                <p className="text-green-700">
                  We've received your message and will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    placeholder="John Doe"
                    {...register('name')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98205 31096"
                    {...register('phone')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                {/* Business Type */}
                <div>
                  <label htmlFor="businessType" className="text-sm font-medium text-foreground">
                    Business Type (Optional)
                  </label>
                  <select
                    id="businessType"
                    {...register('businessType')}
                    onChange={(e) => setValue('businessType', e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  >
                    <option value="">Select a business type</option>
                    <option value="Food & QSR">Food & QSR</option>
                    <option value="Health, Fitness & Wellness">Health, Fitness & Wellness</option>
                    <option value="Education & Training">Education & Training</option>
                    <option value="Retail & Lifestyle">Retail & Lifestyle</option>
                    <option value="Hospitality & Stay">Hospitality & Stay</option>
                    <option value="Kids & Entertainment">Kids & Entertainment</option>
                    <option value="Automobile & EV">Automobile & EV</option>
                    <option value="Business Services">Business Services</option>
                    <option value="Home Services & Real Estate Allied">Home Services & Real Estate Allied</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Investment Capacity */}
                <div>
                  <label htmlFor="investmentCapacity" className="text-sm font-medium text-foreground">
                    Investment Capacity (Optional)
                  </label>
                  <select
                    id="investmentCapacity"
                    {...register('investmentCapacity')}
                    onChange={(e) => setValue('investmentCapacity', e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  >
                    <option value="">Select investment range</option>
                    <option value="0-100k">$0 - $100K</option>
                    <option value="100-250k">$100K - $250K</option>
                    <option value="250-500k">$250K - $500K</option>
                    <option value="500k-1m">$500K - $1M</option>
                    <option value="1m+">$1M+</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell us about your franchise interests and goals..."
                    {...register('message')}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 resize-none"
                    rows={6}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
