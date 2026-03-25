'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Building2,
} from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General',
    message: '',
  })

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert('Message sent!')
  }

  return (
    <>
      {/* ========== HEADER ========== */}
      <section className="section-padding bg-gradient-to-br from-teal-500 to-teal-700 text-white py-20">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Get in Touch
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question about your medication, need a consultation, or want
            to partner with us? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* ========== CONTACT GRID ========== */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left — Contact Info */}
            <div>
              <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6 mb-8">
                <ContactInfoItem
                  icon={<MapPin size={20} />}
                  label="Address"
                  value="14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria"
                />
                <ContactInfoItem
                  icon={<Phone size={20} />}
                  label="Phone"
                  value="+234 XXX XXX XXXX"
                  href="tel:+234XXXXXXXXXX"
                />
                <ContactInfoItem
                  icon={<Mail size={20} />}
                  label="Email"
                  value="info@sebandbayor.com"
                  href="mailto:info@sebandbayor.com"
                />
                <ContactInfoItem
                  icon={<Clock size={20} />}
                  label="Operating Hours"
                  value="Mon - Sat: 8:00 AM - 8:00 PM"
                />
                <ContactInfoItem
                  icon={<Building2 size={20} />}
                  label="Sunday"
                  value="Closed"
                />
              </div>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/234XXXXXXXXXX?text=Hello%2C+I+would+like+to+make+an+enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-6 py-3 rounded-[var(--radius)] transition-colors mb-10"
              >
                <MessageCircle size={18} />
                Chat with Us on WhatsApp
              </a>

              {/* Google Maps Placeholder */}
              <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300">
                <div className="text-center">
                  <MapPin size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-medium">
                    Google Maps
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Embed requires API key
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div>
              <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+234 XXX XXX XXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow bg-white"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Prescription">Prescription Services</option>
                    <option value="Consultations">Consultations</option>
                    <option value="Partnerships">Partnerships</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-[var(--radius)] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow resize-vertical"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary px-8 py-3.5 font-bold gap-2"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ========== Sub-components ========== */

function ContactInfoItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    )
  }

  return content
}
