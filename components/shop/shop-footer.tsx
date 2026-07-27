import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'

const quickLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Upload Prescription', href: '/prescription/upload' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/legal/privacy' },
]

export function ShopFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/anythingdrugs-logo.png"
              alt="AnythingDrugs"
              width={130}
              height={40}
              className="h-9 w-auto mb-3"
            />
            <p className="text-sm leading-relaxed mb-4">
              Your trusted online pharmacy. Pharmacist-verified orders delivered to your door.
            </p>
            <p className="text-sm text-gray-400">
              Powered by{' '}
              <Link href="/about" className="underline hover:text-white transition-colors">
                Seb &amp; Bayor Pharmaceutical Ltd
              </Link>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              Need Help?
            </h4>
            <a
              href="https://wa.me/234XXXXXXXXXX?text=Hello%2C%20I%20need%20help%20with%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors mb-3"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
            <p className="text-sm text-gray-400">
              +234 XXX XXX XXXX
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Mon &ndash; Sat: 8:00 AM &ndash; 8:00 PM
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-max px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Seb &amp; Bayor Pharmaceutical Ltd. All rights reserved.</p>
          <p>PCN Registered | NAFDAC Compliant</p>
        </div>
      </div>
    </footer>
  )
}
