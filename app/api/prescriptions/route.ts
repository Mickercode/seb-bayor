import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { publicProxy, hasSiteKey, toSebPrescriptionCreated, toSebPrescriptionList } from '@/lib/conddo-proxy'

export const dynamic = 'force-dynamic'

/**
 * GET /api/prescriptions
 * List the current customer's prescriptions.
 */
export async function GET() {
  try {
    // ── Proxy to Conddo (works with Conddo JWT) ─────────────────────
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const customerToken = cookieStore.get('token')?.value
      if (customerToken) {
        const result = await publicProxy('GET', '/pharmacy/prescriptions', undefined, customerToken)
        if (result.status < 400) {
          return NextResponse.json(toSebPrescriptionList(result.body))
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { userId: session.userId },
      include: { order: { select: { id: true } } },
      orderBy: { submittedAt: 'desc' },
    })

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error('Get prescriptions error:', error)
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 })
  }
}

/**
 * POST /api/prescriptions
 * Submit a prescription file for pharmacist review.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileUrl, patientName, prescriberName, notes } = body

    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 })
    }

    // ── Proxy to Conddo (works with Conddo JWT) ─────────────────────
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const customerToken = cookieStore.get('token')?.value
      if (customerToken) {
        const result = await publicProxy('POST', '/pharmacy/prescriptions', {
          fileUrl,
          patientName: patientName || '',
          prescriberName: prescriberName || '',
          notes: notes || null,
        }, customerToken)
        if (result.status < 400) {
          return NextResponse.json(toSebPrescriptionCreated(result.body), { status: 201 })
        }
      }
    }

    // ── Fallback: local SQLite ────────────────────────────────────────
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prescription = await prisma.prescription.create({
      data: {
        userId: session.userId,
        fileUrl,
        patientName: patientName || null,
        prescriberName: prescriberName || null,
        reviewNote: notes || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, prescription })
  } catch (error) {
    console.error('Upload prescription error:', error)
    return NextResponse.json({ error: 'Failed to upload prescription' }, { status: 500 })
  }
}
