import { NextResponse } from 'next/server'
import { publicProxy, hasSiteKey } from '@/lib/conddo-proxy'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    // ── If site key configured, proxy to Conddo's public customer auth ──
    if (hasSiteKey) {
      const result = await publicProxy('POST', '/auth/login', {
        email: email.toLowerCase().trim(),
        password,
      })

      if (result.status >= 400) {
        return NextResponse.json(
          { error: 'Invalid email or password.' },
          { status: 401 }
        )
      }

      const respData = result.body as Record<string, unknown>
      const token = respData?.token as string
      const customer = respData?.customer as Record<string, unknown> ?? {}

      if (!token) {
        return NextResponse.json(
          { error: 'Invalid email or password.' },
          { status: 401 }
        )
      }

      const response = NextResponse.json({
        success: true,
        user: {
          id: customer.id,
          email: customer.email,
          fullName: customer.fullName,
          phone: customer.phone,
          role: 'PATIENT',
        },
      })

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })

      return response
    }

    // ── Fallback: local SQLite login (legacy) ──
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const valid = await verifyPassword(password, user.password)

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const jwt = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    })

    response.cookies.set('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
