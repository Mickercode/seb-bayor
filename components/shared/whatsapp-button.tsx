'use client'

import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '234XXXXXXXXXX'
const DEFAULT_MESSAGE = 'Hello, I need help with a medication enquiry.'

export function WhatsAppButton({ message }: { message?: string }) {
  const text = encodeURIComponent(message || DEFAULT_MESSAGE)
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="white" stroke="white" />
    </a>
  )
}
