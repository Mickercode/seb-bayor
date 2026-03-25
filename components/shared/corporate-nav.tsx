'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Digital Health', href: '/digital-health' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function CorporateNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-max flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/seb-bayor-logo.png"
            alt="Seb & Bayor Pharmaceuticals"
            width={140}
            height={50}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-teal-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/shop" className="btn-accent text-sm px-5 py-2">
            Shop AnythingDrugs
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col px-4 py-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-teal-500 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shop"
              className="btn-accent text-sm px-5 py-2 text-center mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Shop AnythingDrugs
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
