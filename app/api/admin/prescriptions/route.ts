import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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
