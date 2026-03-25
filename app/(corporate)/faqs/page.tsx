'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'How do I order medications from AnythingDrugs?',
    answer:
      'Visit our online shop at /shop, browse or search for your medications, add them to your cart, and proceed to checkout. If the medication requires a prescription, you will be prompted to upload it during the ordering process. Our pharmacists will verify your prescription before dispatching your order.',
  },
  {
    question: 'Do I need a prescription to buy medication online?',
    answer:
      'Over-the-counter (OTC) medications such as paracetamol, vitamins, and first-aid supplies can be purchased without a prescription. However, prescription-only medicines (POM) require a valid prescription from a licensed healthcare provider. You can upload your prescription during checkout or send it via WhatsApp.',
  },
  {
    question: 'What areas do you deliver to, and how long does delivery take?',
    answer:
      'We currently deliver within Lagos and are expanding to other major cities across Nigeria. Same-day delivery is available for orders placed before 2:00 PM within Lagos mainland and island. Orders to other areas typically take 1-3 business days depending on your location.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept bank transfers, debit/credit cards (Visa, Mastercard), USSD payments, and mobile wallets. Cash on delivery is available for select areas within Lagos. All online transactions are secured and encrypted.',
  },
  {
    question: 'Can I consult a pharmacist online?',
    answer:
      'Yes. We offer telepharmacy services including phone consultations, video calls, and live WhatsApp chat with registered pharmacists. You can ask questions about your medications, get dosage guidance, check for drug interactions, or discuss minor health concerns. Visit our Digital Health page or click the WhatsApp button to get started.',
  },
  {
    question: 'How does the online prescription review work?',
    answer:
      'Upload a clear photo of your prescription through our website, WhatsApp, or during checkout. A registered pharmacist will review it for authenticity, check for potential drug interactions, confirm dosages, and prepare your medications. You will receive a confirmation once the review is complete, typically within a few hours.',
  },
  {
    question: 'What is your return and refund policy?',
    answer:
      'Due to the nature of pharmaceutical products, we cannot accept returns on medications once dispensed. However, if you receive a damaged, expired, or incorrect product, please contact us within 24 hours of delivery and we will arrange a replacement or full refund. Non-pharmaceutical health products may be returned in unopened condition within 7 days.',
  },
  {
    question: 'Are your pharmacists licensed and registered?',
    answer:
      'Absolutely. All pharmacists at Seb & Bayor are registered with the Pharmacists Council of Nigeria (PCN) and maintain active licenses. Our pharmacy premises are also duly registered and regularly inspected to ensure compliance with all regulatory requirements.',
  },
  {
    question: 'How do you protect my personal and health data?',
    answer:
      'We take data privacy very seriously. All personal and health information is stored securely using encryption and is only accessible to authorized pharmacy staff for the purpose of providing care. We comply with the Nigeria Data Protection Regulation (NDPR) and never share your data with third parties without your explicit consent.',
  },
  {
    question: 'Can I get medications for chronic conditions on a recurring basis?',
    answer:
      'We are building an auto-refill feature that will allow patients with chronic conditions like diabetes, hypertension, and asthma to set up recurring medication orders. This feature is coming soon. In the meantime, you can contact us via WhatsApp or phone to arrange regular refills manually.',
  },
  {
    question: 'How can I contact Seb & Bayor?',
    answer:
      'You can reach us by phone, email (info@sebandbayor.com), WhatsApp, or by visiting our pharmacy at 14 Admiralty Way, Lekki Phase 1, Lagos. Our operating hours are Monday to Saturday, 8:00 AM to 8:00 PM. Visit our Contact page for full details.',
  },
  {
    question: 'Do you offer health screenings or wellness services?',
    answer:
      'Yes, we offer basic health screenings at our physical pharmacy including blood pressure checks, blood glucose monitoring, and BMI assessments. We also provide medication therapy management and minor ailment consultations. Some of these services are also available remotely through our telepharmacy platform.',
  },
]

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* ========== HEADER ========== */}
      <section className="section-padding bg-gradient-to-br from-teal-500 to-teal-700 text-white py-20">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our pharmacy services,
            online ordering, prescriptions, delivery, and more.
          </p>
        </div>
      </section>

      {/* ========== FAQ LIST ========== */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden transition-colors hover:border-teal-300"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle
                      size={20}
                      className={`shrink-0 mt-0.5 transition-colors ${
                        openIndex === index
                          ? 'text-teal-500'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        openIndex === index
                          ? 'text-teal-700'
                          : 'text-gray-900'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 pl-[3.25rem]">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="section-padding bg-gray-50">
        <div className="container-max text-center">
          <h2 className="text-2xl font-bold font-heading text-gray-900 mb-3">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Our team is ready to help. Reach out to us directly and we will get
            back to you as soon as possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary px-8 py-3.5">
              Contact Us
            </Link>
            <a
              href="https://wa.me/234XXXXXXXXXX?text=Hello%2C+I+have+a+question."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-8 py-3.5"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
