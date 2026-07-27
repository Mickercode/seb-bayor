import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { publicProxy, hasSiteKey, toSebAddressList, toSebAddressCreated } from '@/lib/conddo-proxy'

export const dynamic = 'force-dynamic'

/**
 * GET /api/addresses
 * List saved addresses.
 */
export async function GET() {
  try {
    // ── Proxy to Conddo (works with Conddo JWT) ─────────────────────
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const customerToken = cookieStore.get('token')?.value
      if (customerToken) {
        const result = await publicProxy('GET', '/customer/addresses', undefined, customerToken)
        if (result.status < 400) {
          return NextResponse.json(toSebAddressList(result.body))
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
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

/**
 * POST /api/addresses
 * Create a new address.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { label, street, city, state, landmark, isDefault } = body

    if (!street || !city || !state) {
      return NextResponse.json({ error: 'Street, city, and state are required' }, { status: 400 })
    }

    // ── Proxy to Conddo (works with Conddo JWT) ─────────────────────
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const customerToken = cookieStore.get('token')?.value
      if (customerToken) {
        const result = await publicProxy('POST', '/customer/addresses', {
          label: label || 'Home',
          street,
          city,
          state,
          landmark: landmark || null,
          isDefault: isDefault || false,
        }, customerToken)
        if (result.status < 400) {
          return NextResponse.json(toSebAddressCreated(result.body), { status: 201 })
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
