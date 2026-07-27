import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession, getAdminToken } from '@/lib/admin-auth'
import { proxy, hasSiteKey, toSebAdminPrescriptionList } from '@/lib/conddo-proxy'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/prescriptions
 * List all prescriptions for pharmacist review.
 */
export async function GET() {
  try {
    // ── Proxy to Conddo ──────────────────────────────────────────────
    if (hasSiteKey) {
      const token = await getAdminToken()
      if (token) {
        const result = await proxy('GET', '/pharmacy/customer-prescriptions?size=100', undefined, token)
        if (result.status < 400) {
          return NextResponse.json(toSebAdminPrescriptionList(result.body))
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prescriptions = await prisma.prescription.findMany({
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        order: { select: { id: true, status: true, total: true } },
      },
      orderBy: [{ status: 'asc' }, { submittedAt: 'desc' }],
    })

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error('Admin get prescriptions error:', error)
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 })
  }
}
