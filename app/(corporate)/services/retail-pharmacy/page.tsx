import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Pill,
  ShoppingBag,
  MessageCircleHeart,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Retail Pharmacy',
  description:
    'Visit Seb & Bayor for walk-in prescription dispensing, OTC medications, health products, and expert medication counseling.',
}

const services = [
  {
    icon: Pill,
    title: 'Walk-in Prescription Dispensing',
    description:
      'Bring your prescriptions to our pharmacy for accurate, timely dispensing by our PCN-registered pharmacists. We verify every prescription to ensure safety and appropriateness before dispensing.',
  },
  {
    icon: ShoppingBag,
    title: 'OTC Medications & Health Products',
    description:
      'Access a wide range of over-the-counter medications, vitamins, supplements, personal care items, and health products. Our pharmacists are available to help you choose the right products.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Medication Counseling',
    description:
      'Receive personalized medication counseling at the point of dispensing. We explain how to take your medications, potential side effects, drug interactions, and answer all your questions.',
  },
]

export default function RetailPharmacyPage() {
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
              Retail Pharmacy
            </h1>
            <p className="text-lg md:text-xl text-teal-100 leading-relaxed">
              Your trusted neighborhood pharmacy for prescription dispensing, health products, and expert medication counseling.
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
              What We Offer In-Store
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit our physical pharmacy for professional, patient-centered care from our team of registered pharmacists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* What to expect */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-8 text-center">
              What to Expect When You Visit
            </h2>
            <div className="space-y-4">
              {[
                'Warm welcome from our trained pharmacy staff',
                'Professional prescription verification and dispensing',
                'One-on-one medication counseling with a pharmacist',
                'Advice on OTC product selection and proper usage',
                'A clean, organized, and well-stocked pharmacy',
                'Confidential handling of all patient information',
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

      {/* Operating hours & location */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Hours */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Clock size={28} className="text-teal-500" />
                <h2 className="text-2xl font-bold font-heading text-gray-900">
                  Operating Hours
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Monday &ndash; Friday</span>
                  <span className="text-gray-900 font-semibold">8:00 AM &ndash; 8:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Saturday</span>
                  <span className="text-gray-900 font-semibold">9:00 AM &ndash; 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Sunday</span>
                  <span className="text-gray-900 font-semibold">10:00 AM &ndash; 4:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700 font-medium">Public Holidays</span>
                  <span className="text-gray-900 font-semibold">10:00 AM &ndash; 2:00 PM</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={28} className="text-teal-500" />
                <h2 className="text-2xl font-bold font-heading text-gray-900">
                  Our Location
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                We are conveniently located and accessible for walk-in visits. Contact us for detailed directions to our pharmacy.
              </p>
              <div className="flex items-center gap-3 text-gray-700 mb-2">
                <Phone size={18} className="text-teal-500" />
                <span className="text-sm">Call us for directions and inquiries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-teal-500 text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">
            Visit Us Today
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Come experience patient-centered pharmacy care. Our pharmacists are ready to serve you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-sm bg-white text-teal-700 rounded-[var(--radius)] hover:bg-gray-100 transition-colors"
            >
              <MapPin size={16} className="mr-2" />
              Get Our Location
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-sm border-2 border-white text-white rounded-[var(--radius)] hover:bg-white/10 transition-colors"
            >
              Order Online Instead
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
