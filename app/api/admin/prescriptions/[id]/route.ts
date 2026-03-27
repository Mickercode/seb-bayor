import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { sendPrescriptionUpdate } from '@/lib/email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireRole('PHARMACIST')
    const { status, reviewNote } = await request.json()

    if (!['APPROVED', 'QUERIED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const prescription = await prisma.prescription.update({
      where: { id: params.id },
      data: {
        status,
        reviewNote: reviewNote || null,
        pharmacistId: session.userId,
        reviewedAt: new Date(),
      },
    })

    // If approved and linked to an order, update order status
    if (status === 'APPROVED' && prescription.orderId) {
      await prisma.order.update({
        where: { id: prescription.orderId },
        data: { status: 'CONFIRMED' },
      })
    }

    // Send prescription status email (non-blocking)
    const rxUser = await prisma.user.findUnique({
      where: { id: prescription.userId },
      select: { email: true },
    })
    if (rxUser) {
      sendPrescriptionUpdate(rxUser.email, {
        status,
        reviewNote: reviewNote || null,
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, prescription })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update prescription error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
