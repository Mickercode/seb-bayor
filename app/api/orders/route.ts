import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { publicProxy, hasSiteKey, toSebOrderCreated } from '@/lib/conddo-proxy'
import { getDeliveryFee } from '@/lib/delivery-fees'
import { sendOrderConfirmation } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * POST /api/orders
 * Place an order. If hasSiteKey + customer token: proxy to Conddo.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, addressId, notes } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // ── Proxy to Conddo (works with Conddo JWT) ─────────────────────
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const customerToken = cookieStore.get('token')?.value
      if (customerToken) {
        const conddoBody: Record<string, unknown> = {
          items: items.map((i: { productId: string; quantity: number }) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          addressId,
          notes: notes || undefined,
        }

        const result = await publicProxy('POST', '/pharmacy/orders', conddoBody, customerToken)
        if (result.status < 400) {
          const transformed = toSebOrderCreated(result.body)
          // Clear local cart after successful order
          try {
            const session = await getSession()
            if (session) {
              await prisma.cart.upsert({
                where: { userId: session.userId },
                create: { userId: session.userId, items: '[]' },
                update: { items: '[]' },
              })
            }
          } catch {}
          return NextResponse.json(transformed)
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let deliveryFee = 0
    if (addressId) {
      const address = await prisma.address.findUnique({ where: { id: addressId } })
      if (address) {
        deliveryFee = getDeliveryFee(address.state)
      }
    }

    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product || !product.isActive) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 })
      }

      const lineTotal = product.price * item.quantity
      subtotal += lineTotal

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        snapshot: JSON.stringify({ nameGeneric: product.nameGeneric, nameBrand: product.nameBrand, price: product.price }),
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
        items: { create: orderItems },
      },
      include: { items: true },
    })

    await prisma.cart.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, items: '[]' },
      update: { items: '[]' },
    })

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

/**
 * GET /api/orders
 * List the current customer's orders.
 */
export async function GET() {
  try {
    // ── Proxy to Conddo (works with Conddo JWT) ─────────────────────
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const customerToken = cookieStore.get('token')?.value
      if (customerToken) {
        const result = await publicProxy('GET', '/pharmacy/orders', undefined, customerToken)
        if (result.status < 400) {
          const body = result.body as Record<string, unknown>
          const orders = Array.isArray(body?.orders) ? body.orders : []
          return NextResponse.json({ orders })
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
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
