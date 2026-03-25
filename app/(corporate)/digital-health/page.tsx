import Link from 'next/link'
import {
  Phone,
  Video,
  FileUp,
  ShieldCheck,
  MessageCircle,
  ShoppingCart,
  ArrowRight,
  Zap,
  Globe,
  Smartphone,
} from 'lucide-react'

export const metadata = {
  title: 'Digital Health | Seb & Bayor',
  description:
    'Innovative digital health solutions — telepharmacy, online prescription review, pharmacist chat, and the AnythingDrugs e-pharmacy platform.',
}

export default function DigitalHealthPage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative bg-[#1a3a44] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#12EDA9] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-400 rounded-full blur-[150px]" />
        </div>

        <div className="container-max section-padding py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6">
              <Zap size={14} className="text-[#12EDA9]" />
              Digital Health Innovation
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6">
              Healthcare, Reimagined for the Digital Age
            </h1>
            <p className="text-lg md:text-xl text-teal-200 mb-10 leading-relaxed max-w-2xl">
              Access pharmacist consultations, prescription services, and
              quality medications from anywhere in Nigeria — powered by
              technology, guided by professionals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-accent px-8 py-3.5 font-bold">
                Shop AnythingDrugs
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold text-sm border-2 border-white/30 text-white rounded-[var(--radius)] hover:bg-white/10 transition-colors"
              >
                Talk to a Pharmacist
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TELEPHARMACY ========== */}
      <section className="section-padding bg-gray-950 text-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-500/20 text-teal-400 mb-6">
                <Phone size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Telepharmacy
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Speak with a registered pharmacist from the comfort of your
                home. Our telepharmacy service connects you with qualified
                professionals via phone or video call for medication counseling,
                minor ailment management, and prescription guidance.
              </p>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-teal-400 mt-0.5 shrink-0" />
                  Voice consultations for quick medication questions
                </li>
                <li className="flex items-start gap-3">
                  <Video size={18} className="text-teal-400 mt-0.5 shrink-0" />
                  Video calls for detailed health assessments
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-teal-400 mt-0.5 shrink-0" />
                  Confidential, HIPAA-aligned consultations
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mb-4">
                <Video size={40} className="text-teal-400" />
              </div>
              <p className="text-gray-500 text-sm text-center">
                Secure video consultations with registered pharmacists
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ONLINE PRESCRIPTION REVIEW ========== */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-gray-950 border border-gray-800 rounded-2xl p-8">
              <div className="space-y-4">
                {['Upload prescription image', 'Pharmacist reviews & verifies', 'Receive confirmation & pricing', 'Order dispatched or ready for pickup'].map(
                  (step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-gray-300 text-sm">{step}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500/20 text-emerald-400 mb-6">
                <FileUp size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Online Prescription Review
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Upload your prescription digitally and let our pharmacists
                handle the rest. We verify authenticity, check for drug
                interactions, confirm dosages, and prepare your medications —
                all before you leave home.
              </p>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <FileUp size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                  Upload via WhatsApp, web, or in-app
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                  Pharmacist verification within hours
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LIVE PHARMACIST CHAT ========== */}
      <section className="section-padding bg-gray-950 text-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-500/20 text-green-400 mb-6">
                <MessageCircle size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Live Pharmacist Chat
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Have a quick medication question? Chat directly with a
                pharmacist through WhatsApp. Get professional guidance on drug
                interactions, side effects, dosage adjustments, and more — in
                real time.
              </p>
              <a
                href="https://wa.me/234XXXXXXXXXX?text=Hello%2C+I+need+to+speak+with+a+pharmacist."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-6 py-3 rounded-[var(--radius)] transition-colors"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px]">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <MessageCircle size={36} className="text-green-400" />
              </div>
              <p className="text-gray-500 text-sm text-center max-w-xs">
                Integrated WhatsApp messaging for real-time pharmacist support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== E-PHARMACY PLATFORM ========== */}
      <section className="section-padding bg-gradient-to-br from-[#12EDA9]/10 to-teal-900/40 text-white">
        <div className="container-max text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#12EDA9]/20 text-[#12EDA9] mb-6 mx-auto">
            <ShoppingCart size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            AnythingDrugs E-Pharmacy Platform
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Our integrated e-commerce platform brings the pharmacy to your
            fingertips. Browse medications, health products, and wellness
            essentials — all verified and dispensed by registered pharmacists.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <Globe size={24} className="text-[#12EDA9] mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-1">Order Anywhere</h3>
              <p className="text-xs text-gray-400">
                Place orders from any device, anytime
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <ShieldCheck size={24} className="text-[#12EDA9] mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-1">Pharmacist-Verified</h3>
              <p className="text-xs text-gray-400">
                Every order reviewed by a professional
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <Smartphone size={24} className="text-[#12EDA9] mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-1">Track Delivery</h3>
              <p className="text-xs text-gray-400">
                Real-time updates on your order status
              </p>
            </div>
          </div>

          <Link href="/shop" className="btn-accent px-10 py-3.5 font-bold text-base">
            Visit AnythingDrugs Shop
          </Link>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="section-padding bg-[#1a3a44] text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Experience Modern Pharmacy Today
          </h2>
          <p className="text-teal-200 max-w-xl mx-auto mb-8">
            Whether you need medications delivered or want to consult a
            pharmacist online, we have you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="btn-accent px-8 py-3.5 font-bold">
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-sm border-2 border-white/30 text-white rounded-[var(--radius)] hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

