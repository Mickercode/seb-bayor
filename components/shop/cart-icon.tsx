'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CartIcon() {
  const { getItemCount } = useCart()
  const count = getItemCount()

  return (
    <Link href="/cart" className="relative inline-flex items-center">
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-mint-500 text-xs font-semibold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
