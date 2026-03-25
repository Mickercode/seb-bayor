'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

type AddToCartProps = {
  productId: string
  productName: string
  nameBrand?: string | null
  price: number
  stockQty: number
  requiresPrescription?: boolean
  slug: string
}

export function AddToCart({ productId, productName, nameBrand, price, stockQty, requiresPrescription, slug }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  const handleAdd = () => {
    addToCart(
      {
        productId,
        nameGeneric: productName,
        nameBrand: nameBrand ?? null,
        price,
        requiresPrescription: requiresPrescription ?? false,
        slug,
      },
      quantity
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const decrease = () => setQuantity((q) => Math.max(1, q - 1))
  const increase = () => setQuantity((q) => Math.min(10, q + 1))

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
        <div className="inline-flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decrease}
            disabled={quantity <= 1}
            className="p-2.5 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (!isNaN(val)) setQuantity(Math.max(1, Math.min(10, val)))
            }}
            className="w-14 text-center text-sm font-semibold border-x border-gray-300 py-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={increase}
            disabled={quantity >= 10}
            className="p-2.5 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
        {stockQty <= 5 && stockQty > 0 && (
          <p className="text-xs text-amber-600 mt-1">Only {stockQty} left in stock</p>
        )}
        {stockQty === 0 && (
          <p className="text-xs text-red-600 mt-1">Out of stock</p>
        )}
      </div>

      {/* Add to Cart button */}
      <button
        onClick={handleAdd}
        disabled={stockQty === 0}
        className="w-full flex items-center justify-center gap-2 bg-mint-500 hover:bg-mint-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-lg text-base transition-colors"
      >
        {added ? <Check size={20} /> : <ShoppingCart size={20} />}
        {added ? 'Added to cart!' : 'Add to Cart'}
      </button>
    </div>
  )
}
