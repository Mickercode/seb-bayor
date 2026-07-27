import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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

// Get the user's server-side cart
export async function GET() {
  try {
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

// Sync (replace) the user's cart
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items } = body

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 })
    }

    // Validate items — only keep valid product references
    const validItems: CartItemPayload[] = []
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) continue

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          nameGeneric: true,
          nameBrand: true,
          price: true,
          slug: true,
          requiresPrescription: true,
          isActive: true,
          stockQty: true,
        },
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
      create: {
        userId: session.userId,
        items: JSON.stringify(validItems),
      },
      update: {
        items: JSON.stringify(validItems),
      },
    })

    return NextResponse.json({ items: validItems })
  } catch (error) {
    console.error('Sync cart error:', error)
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 })
  }
}

// Clear the user's cart
export async function DELETE() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.cart.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        items: '[]',
      },
      update: {
        items: '[]',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clear cart error:', error)
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
  }
}
