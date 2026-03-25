'use client'

import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag, AlertTriangle } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, hasRxItems } = useCart()

  const subtotal = getCartTotal()

  if (cart.length === 0) {
    return (
      <section className="section-padding">
        <div className="container-max text-center py-20">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your Cart</h1>
          <p className="text-gray-500 mb-8">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-block rounded-lg bg-mint-500 px-8 py-3 font-semibold text-white hover:bg-mint-600 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <div className="container-max">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4"
                >
                  {/* Placeholder image */}
                  <div className="h-20 w-20 flex-shrink-0 rounded-md bg-gray-200" />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.nameGeneric}
                        </h3>
                        {item.nameBrand && (
                          <p className="text-sm text-gray-500">{item.nameBrand}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="flex-shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-gray-600">
                      {`₦${item.price.toLocaleString()}`} each
                    </p>

                    {item.requiresPrescription && (
                      <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Rx Required
                      </span>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity stepper */}
                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="font-semibold text-gray-900">
                        {`₦${(item.price * item.quantity).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prescription notice */}
            {hasRxItems() && (
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
                <p className="text-sm text-amber-800">
                  One or more items require a valid prescription. You&apos;ll upload it during checkout.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:col-span-4 lg:mt-0">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{`₦${subtotal.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">{`₦${subtotal.toLocaleString()}`}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-lg bg-mint-500 py-3 text-center font-semibold text-white hover:bg-mint-600 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="mt-3 block w-full text-center text-sm font-medium text-mint-600 hover:text-mint-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
