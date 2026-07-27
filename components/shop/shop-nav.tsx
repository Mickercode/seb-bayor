'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

const navLinks = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Upload Rx', href: '/prescription/upload' },
]

const categoryLinks = [
  { label: 'Pain & Fever', href: '/shop/pain-fever' },
  { label: 'Antibiotics', href: '/shop/antibiotics' },
  { label: 'Vitamins & Supplements', href: '/shop/vitamins-supplements' },
  { label: 'First Aid', href: '/shop/first-aid' },
  { label: 'View All Categories', href: '/shop/categories' },
]

export function ShopNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const { getItemCount } = useCart()
  const cartCount = getItemCount()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-max flex items-center justify-between h-16 px-4 md:px-8">
        {/* Wordmark */}
        <Link href="/shop" className="flex items-center">
          <Image
            src="/anythingdrugs-logo.png"
            alt="AnythingDrugs"
            width={150}
            height={45}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Categories dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              onBlur={() => setTimeout(() => setCategoriesOpen(false), 150)}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Categories
              <ChevronDown size={16} className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            {categoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                {categoryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Account */}
          <Link
            href="/auth/login"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <User size={18} />
            Login
          </Link>

          {/* Cart */}
          <Link href="/shop/cart" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
              >
                {cartCount}
              </span>
            )}
            {cartCount === 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-gray-200 text-gray-600"
              >
                0
              </span>
            )}
          </Link>

          {/* Speak to Pharmacist CTA */}
          <a
            href="https://wa.me/234XXXXXXXXXX?text=Hello%2C%20I%20need%20to%20speak%20with%20a%20pharmacist."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex btn-accent text-sm px-4 py-2"
          >
            Speak to Pharmacist
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Categories (expanded in mobile) */}
            <div className="py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Categories</span>
              <div className="mt-2 flex flex-col gap-1 pl-2">
                {categoryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-gray-900 py-1.5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2 flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <User size={16} />
              Login
            </Link>

            <a
              href="https://wa.me/234XXXXXXXXXX?text=Hello%2C%20I%20need%20to%20speak%20with%20a%20pharmacist."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent text-sm px-5 py-2 text-center mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Speak to Pharmacist
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
