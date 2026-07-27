import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { sendOrderStatusUpdate } from '@/lib/email'
import { proxy, hasSiteKey, toSebAdminOrderDetail } from '@/lib/conddo-proxy'
import { getAdminToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/orders/{id}
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ── Proxy to Conddo ──────────────────────────────────────────────
    if (hasSiteKey) {
      const token = await getAdminToken()
      if (token) {
        const result = await proxy('GET', `/orders/${params.id}`, undefined, token)
        if (result.status < 400) {
          return NextResponse.json(toSebAdminOrderDetail(result.body))
        }
        if (result.status === 404) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    await requireRole('PHARMACIST')

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        address: true,
        items: {
          include: {
            product: { select: { nameGeneric: true, nameBrand: true, slug: true } },
          },
        },
        prescriptions: {
          include: { pharmacist: { select: { fullName: true } } },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get order error:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/orders/{id}
 * Update order status.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()

    const validStatuses = ['PENDING', 'RX_REVIEW', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED']

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // ── Proxy to Conddo ──────────────────────────────────────────────
    if (hasSiteKey) {
      const token = await getAdminToken()
      if (token) {
        // Use POST /orders/{id}/transition for stage changes
        const result = await proxy('POST', `/orders/${params.id}/transition`, { stage: status }, token)
        if (result.status < 400) {
          return NextResponse.json({ success: true })
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    await requireRole('PHARMACIST')

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { user: { select: { email: true } } },
    })

    if (['CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      sendOrderStatusUpdate(order.user.email, { id: order.id, status }).catch(() => {})
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update order error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
