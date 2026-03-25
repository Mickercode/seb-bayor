import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.userId },
      orderBy: { isDefault: 'desc' },
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error('Get addresses error:', error)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { label, street, city, state, landmark, isDefault } = body

    if (!street || !city || !state) {
      return NextResponse.json(
        { error: 'Street, city, and state are required' },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        label: label || 'Home',
        street,
        city,
        state,
        landmark,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json({ success: true, address })
  } catch (error) {
    console.error('Create address error:', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}
