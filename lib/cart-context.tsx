'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface CartItem {
  productId: string
  nameGeneric: string
  nameBrand: string | null
  price: number
  quantity: number
  requiresPrescription: boolean
  slug: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getItemCount: () => number
  hasRxItems: () => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'seb-bayor-cart'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCart(cart: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // localStorage may be unavailable
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCart(loadCart())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      saveCart(cart)
    }
  }, [cart, mounted])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { ...item, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId))
      return
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const getItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }, [cart])

  const hasRxItems = useCallback(() => {
    return cart.some((item) => item.requiresPrescription)
  }, [cart])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        hasRxItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
