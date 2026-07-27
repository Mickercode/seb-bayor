import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession, getAdminToken } from '@/lib/admin-auth'
import { proxy, hasSiteKey, toSebAdminCustomerList } from '@/lib/conddo-proxy'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/customers
 * List all customers (patients) registered on the site.
 */
export async function GET() {
  try {
    // ── Proxy to Conddo ──────────────────────────────────────────────
    if (hasSiteKey) {
      const token = await getAdminToken()
      if (token) {
        const result = await proxy('GET', '/customers?size=200', undefined, token)
        if (result.status < 400) {
          return NextResponse.json(toSebAdminCustomerList(result.body))
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customers = await prisma.user.findMany({
      where: { role: 'PATIENT' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true, prescriptions: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Admin get customers error:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
