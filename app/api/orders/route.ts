import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getDeliveryFee } from '@/lib/delivery-fees'
import { sendOrderConfirmation } from '@/lib/email'

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items, addressId, notes } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Fetch address for delivery fee
    let deliveryFee = 0
    if (addressId) {
      const address = await prisma.address.findUnique({ where: { id: addressId } })
      if (address) {
        deliveryFee = getDeliveryFee(address.state)
      }
    }

    // Calculate totals from actual product prices
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        )
      }

      const lineTotal = product.price * item.quantity
      subtotal += lineTotal

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        snapshot: JSON.stringify({
          nameGeneric: product.nameGeneric,
          nameBrand: product.nameBrand,
          price: product.price,
        }),
      })
    }

    const total = subtotal + deliveryFee

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        status: 'PENDING',
        subtotal,
        deliveryFee,
        total,
        addressId,
        paymentStatus: 'PENDING',
        notes,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    })

    // Clear the server-side cart after order is placed
    await prisma.cart.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, items: '[]' },
      update: { items: '[]' },
    })

    // Send order confirmation email (non-blocking)
    sendOrderConfirmation(session.email, {
      id: order.id,
      total,
      itemCount: orderItems.length,
    }).catch(() => {})

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

// Get current user's orders
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      include: {
        items: { include: { product: true } },
        address: true,
        prescriptions: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
