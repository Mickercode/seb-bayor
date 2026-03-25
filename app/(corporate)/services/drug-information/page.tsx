import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  AlertTriangle,
  HeartPulse,
  Users,
  ClipboardCheck,
  CheckCircle2,
  Phone,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Drug Information Services',
  description:
    'Access professional drug counseling, medication safety guidance, interaction checks, and public health information from Seb & Bayor pharmacists.',
}

const services = [
  {
    icon: BookOpen,
    title: 'Drug Counseling for Patients & Caregivers',
    description:
      'Our pharmacists provide clear, understandable information about your medications — what they do, how to take them, expected outcomes, and what to watch out for. We support both patients and their caregivers.',
  },
  {
    icon: AlertTriangle,
    title: 'Medication Safety & Interaction Guidance',
    description:
      'We review your medications for potential interactions, contraindications, and safety concerns. Whether you are taking multiple medications or starting a new one, we help you understand the risks and stay safe.',
  },
  {
    icon: HeartPulse,
    title: 'Public Health Information Resources',
    description:
      'Stay informed with evidence-based health information on disease prevention, medication adherence, vaccination awareness, and wellness practices curated by our pharmacy team.',
  },
  {
    icon: Users,
    title: 'Support for Healthcare Professionals',
    description:
      'We provide drug information support to physicians, nurses, and other healthcare professionals. Access our pharmacists for medication queries, formulary guidance, and clinical references.',
  },
]

export default function DrugInformationPage() {
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
              Drug Information Services
            </h1>
            <p className="text-lg md:text-xl text-teal-100 leading-relaxed">
              Professional, evidence-based drug information and medication guidance for patients, caregivers, and healthcare professionals.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 50C480 40 240 10 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-3">
              How We Can Help
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our drug information services are available to anyone who needs reliable medication guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.title}
                  className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 text-teal-600 mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-8 text-center">
              Who We Serve
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="font-bold font-heading text-gray-900 mb-3 flex items-center gap-2">
                  <ClipboardCheck size={20} className="text-teal-500" />
                  Patients &amp; Caregivers
                </h3>
                <ul className="space-y-2">
                  {[
                    'Understanding your medications',
                    'Managing side effects',
                    'Medication storage and handling',
                    'Adherence and scheduling support',
                    'Over-the-counter product guidance',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-teal-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="font-bold font-heading text-gray-900 mb-3 flex items-center gap-2">
                  <Users size={20} className="text-teal-500" />
                  Healthcare Professionals
                </h3>
                <ul className="space-y-2">
                  {[
                    'Drug interaction queries',
                    'Dosing and formulation guidance',
                    'Therapeutic alternatives',
                    'Evidence-based clinical references',
                    'Medication safety reporting',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-teal-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-teal-500 text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">
            Have a Medication Question?
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Our pharmacists are available to provide the drug information and guidance you need. Reach out today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold text-sm bg-white text-teal-700 rounded-[var(--radius)] hover:bg-gray-100 transition-colors"
            >
              <Phone size={16} />
              Contact Us
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-sm border-2 border-white text-white rounded-[var(--radius)] hover:bg-white/10 transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
