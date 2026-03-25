'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, CheckCircle, FileText, MessageCircle } from 'lucide-react'

export default function PrescriptionUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [patientName, setPatientName] = useState('')
  const [prescriberName, setPrescriberName] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!file) {
      setError('Please upload your prescription file')
      return
    }

    if (!patientName) {
      setError('Please enter the patient name')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // For now, just simulate — actual Cloudinary upload in production
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch {
      setError('Failed to upload prescription. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="section-padding bg-gray-50 min-h-screen" data-zone="shop">
        <div className="container-max max-w-lg text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle size={36} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Prescription Uploaded</h1>
            <p className="text-gray-600 mb-2">
              Your prescription has been submitted and will be reviewed by our pharmacist within 2 hours.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Reference: <span className="font-mono font-bold">RX-{Date.now().toString(36).toUpperCase()}</span>
            </p>

            <div className="flex flex-col gap-3">
              <Link href="/shop" className="btn-accent py-3">
                Browse Medications
              </Link>
              <a
                href="https://wa.me/234XXXXXXXXXX?text=Hello%2C+I+just+uploaded+a+prescription+and+would+like+to+follow+up."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline py-3 flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} /> Follow Up on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding bg-gray-50 min-h-screen" data-zone="shop">
      <div className="container-max max-w-lg">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-mint-100 flex items-center justify-center text-mint-600">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Upload Prescription</h1>
              <p className="text-sm text-gray-600">
                Upload your prescription to order regulated medications.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload size={28} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag & drop or click to upload (JPG, PNG, PDF — max 10MB)
              </p>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
              {file && (
                <p className="mt-2 text-sm text-green-600 flex items-center justify-center gap-1">
                  <CheckCircle size={14} /> {file.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Full name as on prescription"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescriber / Doctor Name
              </label>
              <input
                type="text"
                value={prescriberName}
                onChange={(e) => setPrescriberName(e.target.value)}
                placeholder="Dr. Adebayo"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes to Pharmacist
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information about your prescription..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              Prescriptions are reviewed within 2 hours by our registered pharmacists.
              You will be notified via WhatsApp when your prescription is approved.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-accent w-full py-3 disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Prescription'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
