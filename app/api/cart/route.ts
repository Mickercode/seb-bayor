import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { publicProxy, hasSiteKey, toSebCart } from '@/lib/conddo-proxy'

export const dynamic = 'force-dynamic'

export interface CartItemPayload {
  productId: string
  nameGeneric: string
  nameBrand: string | null
  price: number
  quantity: number
  requiresPrescription: boolean
  slug: string
}

/**
 * GET /api/cart
 * If hasSiteKey + customer token: proxy to Conddo's public cart API.
 * Otherwise: read from local SQLite (legacy).
 */
export async function GET() {
  try {
    // ── Proxy to Conddo (works with Conddo JWT) ─────────────────────
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const customerToken = cookieStore.get('token')?.value
      if (customerToken) {
        const result = await publicProxy('GET', '/pharmacy/cart', undefined, customerToken)
        if (result.status < 400) {
          return NextResponse.json(toSebCart(result.body))
        }
      }
    }

    // ── Fallback: local SQLite (requires local JWT) ──────────────────
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
    })

    const items: CartItemPayload[] = cart ? JSON.parse(cart.items) : []
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

/**
 * PUT /api/cart
 * Sync (replace) the user's cart.
 * Conddo's cart is per-item, so we: clear → POST each item.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 })
    }

    // ── Proxy to Conddo (works with Conddo JWT) ─────────────────────
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const customerToken = cookieStore.get('token')?.value
      if (customerToken) {
        // Clear cart first
        await publicProxy('DELETE', '/pharmacy/cart', undefined, customerToken)
        // Upsert each item
        for (const item of items) {
          if (!item.productId || !item.quantity || item.quantity < 1) continue
          await publicProxy('POST', '/pharmacy/cart', {
            productId: item.productId,
            quantity: Math.min(item.quantity, 10),
          }, customerToken)
        }
        // Read back
        const result = await publicProxy('GET', '/pharmacy/cart', undefined, customerToken)
        return NextResponse.json(toSebCart(result.body))
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const validItems: CartItemPayload[] = []
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) continue

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, nameGeneric: true, nameBrand: true, price: true, slug: true, requiresPrescription: true, isActive: true, stockQty: true },
      })

      if (!product || !product.isActive) continue

      validItems.push({
        productId: product.id,
        nameGeneric: product.nameGeneric,
        nameBrand: product.nameBrand,
        price: product.price,
        quantity: Math.min(item.quantity, 10, product.stockQty),
        requiresPrescription: product.requiresPrescription,
        slug: product.slug,
      })
    }

    await prisma.cart.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, items: JSON.stringify(validItems) },
      update: { items: JSON.stringify(validItems) },
    })

    return NextResponse.json({ items: validItems })
  } catch (error) {
    console.error('Sync cart error:', error)
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 })
  }
}

/**
 * DELETE /api/cart
 */
export async function DELETE() {
  try {
    // ── Proxy to Conddo (works with Conddo JWT) ─────────────────────
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const customerToken = cookieStore.get('token')?.value
      if (customerToken) {
        await publicProxy('DELETE', '/pharmacy/cart', undefined, customerToken)
        return NextResponse.json({ success: true })
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.cart.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, items: '[]' },
      update: { items: '[]' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clear cart error:', error)
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
  }
}
