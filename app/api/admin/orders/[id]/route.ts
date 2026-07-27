import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { sendOrderStatusUpdate } from '@/lib/email'

export const dynamic = 'force-dynamic'

// Get order detail
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole('PHARMACIST')
    const { status } = await request.json()

    const validStatuses = [
      'PENDING',
      'RX_REVIEW',
      'CONFIRMED',
      'DISPATCHED',
      'DELIVERED',
      'CANCELLED',
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { user: { select: { email: true } } },
    })

    // Send email notification for status changes (non-blocking)
    if (['CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      sendOrderStatusUpdate(order.user.email, {
        id: order.id,
        status,
      }).catch(() => {})
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
