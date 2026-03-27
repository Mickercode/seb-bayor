import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Update an address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: params.id, userId: session.userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    const body = await request.json()
    const { label, street, city, state, landmark, isDefault } = body

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId, id: { not: params.id } },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.update({
      where: { id: params.id },
      data: {
        ...(label !== undefined && { label }),
        ...(street !== undefined && { street }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(landmark !== undefined && { landmark }),
        ...(isDefault !== undefined && { isDefault }),
      },
    })

    return NextResponse.json({ success: true, address })
  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

// Delete an address
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existing = await prisma.address.findFirst({
      where: { id: params.id, userId: session.userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    await prisma.address.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}
