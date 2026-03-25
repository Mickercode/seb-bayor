import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

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
    })

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
