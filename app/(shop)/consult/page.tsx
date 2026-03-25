'use client'

import { useState } from 'react'
import { MessageCircle, Phone, Clock, CheckCircle } from 'lucide-react'

export default function ConsultPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Open WhatsApp with pre-filled message
    const message = encodeURIComponent(
      `Hello, I'd like to consult with a pharmacist.\n\nName: ${name}\nPhone: ${phone}\nTopic: ${topic}`
    )
    window.open(`https://wa.me/234XXXXXXXXXX?text=${message}`, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="section-padding bg-gray-50 min-h-screen" data-zone="shop">
        <div className="container-max max-w-lg text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle size={36} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Consultation Request Sent</h1>
            <p className="text-gray-600 mb-6">
              A pharmacist will respond to you on WhatsApp shortly. Our consultation hours
              are Monday to Saturday, 8:00 AM – 8:00 PM.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-outline py-2 px-6"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding bg-gray-50 min-h-screen" data-zone="shop">
      <div className="container-max max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Consult a Pharmacist</h1>
          <p className="text-gray-600">
            Speak with a registered pharmacist via WhatsApp for medication guidance,
            drug information, or minor ailment consultations.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <MessageCircle size={24} className="mx-auto text-green-500 mb-2" />
            <p className="text-xs font-medium">Via WhatsApp</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Clock size={24} className="mx-auto text-mint-500 mb-2" />
            <p className="text-xs font-medium">15 min sessions</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Phone size={24} className="mx-auto text-blue-500 mb-2" />
            <p className="text-xs font-medium">Mon–Sat</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 XXX XXX XXXX"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What would you like to discuss? *
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., I need advice about my blood pressure medication..."
                rows={4}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button type="submit" className="btn-accent w-full py-3 flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Open WhatsApp Consultation
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            This service is for general pharmaceutical guidance only and does not replace
            professional medical diagnosis or treatment.
          </p>
        </div>
      </div>
    </div>
  )
}
