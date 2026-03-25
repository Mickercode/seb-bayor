import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Search,
  Upload,
  ShoppingCart,
  MessageSquare,
  ShieldCheck,
  BadgeCheck,
  Truck,
  MonitorSmartphone,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'E-Pharmacy (AnythingDrugs)',
  description:
    'Order medications online through AnythingDrugs by Seb & Bayor. Search, upload prescriptions, order, and consult with pharmacists digitally.',
}

const capabilities = [
  {
    icon: Search,
    title: 'Search Medications',
    description:
      'Browse and search our comprehensive catalogue of verified medications, health products, and wellness items.',
  },
  {
    icon: Upload,
    title: 'Upload Prescriptions',
    description:
      'Securely upload your prescriptions for pharmacist review. We verify every prescription before processing your order.',
  },
  {
    icon: ShoppingCart,
    title: 'Order & Get Delivered',
    description:
      'Place your order online and choose from delivery options. Get your medications delivered to your doorstep.',
  },
  {
    icon: MessageSquare,
    title: 'Consult a Pharmacist',
    description:
      'Have questions about your medications? Chat with or call our registered pharmacists directly through the platform.',
  },
]

const trustPoints = [
  {
    icon: BadgeCheck,
    title: 'Pharmacist-Reviewed',
    description: 'Every prescription is reviewed by a PCN-registered pharmacist before dispensing.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Medications',
    description: 'All products are sourced from verified, NAFDAC-approved manufacturers and distributors.',
  },
  {
    icon: Truck,
    title: 'Reliable Delivery',
    description: 'Secure packaging and reliable delivery to ensure your medications reach you safely.',
  },
]

export default function EPharmacyPage() {
  return (
    <>
      {/* Hero — mint-themed */}
      <section className="relative bg-gradient-to-br from-emerald-400 to-teal-600 text-white">
        <div className="container-max section-padding py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-emerald-100 font-semibold text-sm uppercase tracking-wider mb-3">
              Services
            </p>
            <div className="flex items-center gap-3 mb-6">
              <MonitorSmartphone size={40} />
              <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
                AnythingDrugs
              </h1>
            </div>
            <p className="text-lg md:text-xl text-emerald-100 leading-relaxed mb-4">
              Your trusted e-pharmacy platform by Seb &amp; Bayor. Search medications, upload prescriptions, order online, and consult pharmacists — all from the comfort of your home.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold text-sm bg-white text-emerald-700 rounded-[var(--radius)] hover:bg-gray-100 transition-colors mt-4"
            >
              Go to AnythingDrugs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 50C480 40 240 10 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* What you can do */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-3">
              What You Can Do on AnythingDrugs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A seamless digital pharmacy experience backed by professional pharmacist oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="text-center p-6 rounded-lg border border-emerald-100 bg-emerald-50/50 hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-bold font-heading text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-8 text-center">
              How It Works
            </h2>
            <div className="space-y-6">
              {[
                { step: '1', text: 'Browse or search for your medication on AnythingDrugs.' },
                { step: '2', text: 'Upload your prescription if required, or select OTC products directly.' },
                { step: '3', text: 'A registered pharmacist reviews your order for safety and accuracy.' },
                { step: '4', text: 'Confirm your order and choose a delivery option.' },
                { step: '5', text: 'Receive your verified medications at your doorstep.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <p className="text-gray-700 pt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-3">
              Your Safety Is Our Priority
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              AnythingDrugs is backed by Seb &amp; Bayor&apos;s commitment to pharmaceutical standards and patient safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustPoints.map((point) => {
              const Icon = point.icon
              return (
                <div key={point.title} className="flex flex-col items-center text-center p-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-bold font-heading text-gray-900 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="section-padding bg-emerald-50">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6 text-center">
              Why Choose AnythingDrugs?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Licensed and regulated pharmacy practice',
                'Pharmacist-reviewed prescriptions',
                'NAFDAC-compliant medications only',
                'Convenient home delivery',
                'Real-time pharmacist consultations',
                'Secure and confidential ordering',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">
            Ready to Order Your Medications?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            Visit AnythingDrugs to browse our catalogue, upload your prescription, and get your medications delivered.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 font-bold text-sm bg-white text-emerald-700 rounded-[var(--radius)] hover:bg-gray-100 transition-colors"
          >
            Go to AnythingDrugs <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
