'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'

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
  isSyncing: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'seb-bayor-cart'

function loadLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLocalCart(cart: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // localStorage may be unavailable
  }
}

// Merge two carts — server items take priority for shared products, local-only items are added
function mergeCarts(serverItems: CartItem[], localItems: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>()

  // Server items first (authoritative prices)
  for (const item of serverItems) {
    merged.set(item.productId, item)
  }

  // Add local-only items, update quantities for shared items
  for (const item of localItems) {
    const existing = merged.get(item.productId)
    if (existing) {
      // Keep server price, use higher quantity
      merged.set(item.productId, {
        ...existing,
        quantity: Math.min(Math.max(existing.quantity, item.quantity), 10),
      })
    } else {
      merged.set(item.productId, item)
    }
  }

  return Array.from(merged.values())
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipNextSync = useRef(false)

  // Initial load: check auth status, load local cart, merge with server if logged in
  useEffect(() => {
    async function init() {
      const localItems = loadLocalCart()

      try {
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          setIsLoggedIn(true)

          const serverItems: CartItem[] = data.items || []
          const merged = mergeCarts(serverItems, localItems)
          setCart(merged)
          saveLocalCart(merged)

          // If merge produced changes, sync back to server
          if (merged.length !== serverItems.length || localItems.length > 0) {
            skipNextSync.current = true
            await syncToServer(merged)
          }
        } else {
          // Not logged in — use local cart only
          setCart(localItems)
        }
      } catch {
        // Network error — use local cart
        setCart(localItems)
      }

      setMounted(true)
    }

    init()
  }, [])

  // Sync to server (debounced by cart changes)
  async function syncToServer(items: CartItem[]) {
    if (!isLoggedIn && !skipNextSync.current) return

    try {
      setIsSyncing(true)
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
    } catch {
      // Silently fail — localStorage is the fallback
    } finally {
      setIsSyncing(false)
    }
  }

  // When cart changes, save locally and debounce sync to server
  useEffect(() => {
    if (!mounted) return

    saveLocalCart(cart)

    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }

    if (!isLoggedIn) return

    // Debounce server sync by 500ms
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
    }
    syncTimeoutRef.current = setTimeout(() => {
      syncToServer(cart)
    }, 500)

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [cart, mounted, isLoggedIn])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
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
        i.productId === productId ? { ...i, quantity: Math.min(quantity, 10) } : i
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    if (isLoggedIn) {
      fetch('/api/cart', { method: 'DELETE' }).catch(() => {})
    }
  }, [isLoggedIn])

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
        isSyncing,
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
