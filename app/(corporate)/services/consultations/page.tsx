import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Stethoscope,
  ClipboardList,
  HeartPulse,
  Video,
  MessageCircle,
  Phone,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Health Consultations',
  description:
    'Book health consultations with Seb & Bayor pharmacists — minor ailment management, medication therapy management, chronic disease support, and teleconsultations.',
}

const consultationTypes = [
  {
    icon: Stethoscope,
    title: 'Minor Ailment Management',
    description:
      'Consult our pharmacists for common health concerns such as headaches, colds, allergies, skin conditions, and digestive issues. We assess, advise, and recommend appropriate treatments.',
  },
  {
    icon: ClipboardList,
    title: 'Medication Therapy Management (MTM)',
    description:
      'Comprehensive review of all your medications to optimize therapy outcomes. We identify issues like drug interactions, duplications, and non-adherence, and work with you and your doctor to resolve them.',
  },
  {
    icon: HeartPulse,
    title: 'Chronic Disease Medication Support',
    description:
      'Ongoing pharmacist support for managing chronic conditions such as diabetes, hypertension, and asthma. We help you stay on track with your medication regimen and monitor therapy goals.',
  },
  {
    icon: Video,
    title: 'Teleconsultation',
    description:
      'Access pharmacist consultations remotely through our digital health channels. Speak to a pharmacist via phone or video without visiting the pharmacy.',
  },
]

export default function ConsultationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-500 to-teal-700 text-white">
        <div className="container-max section-padding py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-teal-200 font-semibold text-sm uppercase tracking-wider mb-3">
              Services
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight mb-6">
              Health Consultations
            </h1>
            <p className="text-lg md:text-xl text-teal-100 leading-relaxed">
              Professional pharmacist consultations for minor ailments, medication management, chronic disease support, and remote care.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 50C480 40 240 10 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Consultation types */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-3">
              Consultation Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our registered pharmacists offer a range of consultation services to support your health and medication needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {consultationTypes.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 text-teal-600 mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  {item.title === 'Teleconsultation' && (
                    <Link
                      href="/digital-health"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 mt-4 hover:gap-3 transition-all"
                    >
                      Learn about Digital Health <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-8 text-center">
              What to Expect During a Consultation
            </h2>
            <div className="space-y-4">
              {[
                'A private, confidential discussion with a registered pharmacist',
                'Thorough assessment of your symptoms or medication concerns',
                'Evidence-based recommendations and treatment plans',
                'Referral to a physician when necessary',
                'Follow-up guidance and ongoing support',
                'Clear documentation of your consultation outcomes',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-teal-500 mt-0.5 shrink-0" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Teleconsultation pathway */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-3xl mx-auto text-center">
            <Video size={40} className="text-teal-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">
              Prefer a Remote Consultation?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Access pharmacist consultations from anywhere through our digital health channels. No need to visit the pharmacy.
            </p>
            <Link href="/digital-health" className="btn-primary px-8 py-3.5">
              Explore Digital Health Options
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-teal-500 text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">
            Speak to a Pharmacist Now
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Whether you have a quick question or need a comprehensive consultation, our pharmacists are here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/234XXXXXXXXXX?text=Hello%2C+I+would+like+to+book+a+consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold text-sm bg-white text-teal-700 rounded-[var(--radius)] hover:bg-gray-100 transition-colors"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold text-sm border-2 border-white text-white rounded-[var(--radius)] hover:bg-white/10 transition-colors"
            >
              <Phone size={16} />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
