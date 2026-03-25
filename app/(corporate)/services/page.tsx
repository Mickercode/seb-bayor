import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Pill,
  MonitorSmartphone,
  ClipboardCheck,
  Stethoscope,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Explore Seb & Bayor\'s comprehensive pharmacy services — retail dispensing, e-pharmacy, drug information, and health consultations.',
}

const services = [
  {
    icon: Pill,
    title: 'Retail Pharmacy',
    description:
      'Walk-in prescription dispensing, OTC medications, health products, and medication counseling at our physical location.',
    href: '/services/retail-pharmacy',
    accent: false,
  },
  {
    icon: MonitorSmartphone,
    title: 'E-Pharmacy (AnythingDrugs)',
    description:
      'Order medications online through AnythingDrugs — our pharmacist-verified digital pharmacy platform.',
    href: '/services/e-pharmacy',
    accent: true,
  },
  {
    icon: ClipboardCheck,
    title: 'Drug Information Services',
    description:
      'Professional drug counseling, medication safety guidance, and public health information for patients and healthcare professionals.',
    href: '/services/drug-information',
    accent: false,
  },
  {
    icon: Stethoscope,
    title: 'Health Consultations',
    description:
      'Minor ailment management, medication therapy management, chronic disease support, and teleconsultation services.',
    href: '/services/consultations',
    accent: false,
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-500 to-teal-700 text-white">
        <div className="container-max section-padding py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight mb-6">
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-teal-100 leading-relaxed">
              Comprehensive pharmacy and healthcare services designed to meet your needs — in-store, online, and through professional consultations.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 50C480 40 240 10 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`group block p-8 rounded-lg border transition-all hover:shadow-lg ${
                    service.accent
                      ? 'bg-mint-50 border-mint-200 hover:border-mint-400'
                      : 'bg-white border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div className={`mb-4 ${service.accent ? 'text-mint-600' : 'text-teal-500'}`}>
                    <Icon size={36} />
                  </div>
                  <h2 className="text-xl font-bold font-heading text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 group-hover:gap-3 transition-all">
                    Learn more <ArrowRight size={16} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">
            Not Sure What You Need?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Reach out to us and our pharmacists will guide you to the right service for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary px-8 py-3.5">
              Contact Us
            </Link>
            <Link href="/shop" className="btn-outline px-8 py-3.5">
              Shop AnythingDrugs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
