import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Get user's prescriptions
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { userId: session.userId },
      include: {
        order: { select: { id: true } },
      },
      orderBy: { submittedAt: 'desc' },
    })

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error('Get prescriptions error:', error)
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 })
  }
}

// Upload a prescription (standalone, not tied to an order)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fileUrl, patientName, prescriberName, notes } = body

    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 })
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
