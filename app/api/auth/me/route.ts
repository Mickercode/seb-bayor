import { NextResponse } from 'next/server'
import { publicProxy, hasSiteKey } from '@/lib/conddo-proxy'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // ── If site key configured, get customer info from Conddo ──
    if (hasSiteKey) {
      const cookieStore = await cookies()
      const token = cookieStore.get('token')?.value

      if (!token) {
        return NextResponse.json(
          { error: 'Not authenticated.' },
          { status: 401 }
        )
      }

      const result = await publicProxy('GET', '/auth/me', undefined, token)

      if (result.status >= 400) {
        return NextResponse.json(
          { error: 'Not authenticated.' },
          { status: 401 }
        )
      }

      const respData = result.body as Record<string, unknown>
      const customer = (respData?.customer as Record<string, unknown>) ?? {}

      return NextResponse.json({
        success: true,
        user: {
          id: customer.id,
          email: customer.email,
          phone: customer.phone,
          fullName: customer.fullName,
          role: 'PATIENT',
          createdAt: customer.createdAt,
        },
      })
    }

    // ── Fallback: local SQLite (legacy) ──
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated.' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
