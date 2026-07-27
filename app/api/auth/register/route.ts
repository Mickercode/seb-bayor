import { NextResponse } from 'next/server'
import { publicProxy, hasSiteKey } from '@/lib/conddo-proxy'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, password } = body

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Full name, email, phone, and password are required.' },
        { status: 400 }
      )
    }

    // ── If the site key is configured, proxy to Conddo's public customer auth ──
    if (hasSiteKey) {
      const result = await publicProxy('POST', '/auth/register', {
        fullName,
        email: email.toLowerCase().trim(),
        phone,
        password,
      })

      if (result.status >= 400) {
        const errBody = result.body as Record<string, unknown>
        const err = (errBody?.error as Record<string, unknown>) ?? {}
        const message = (err?.message as string) || 'Registration failed.'
        return NextResponse.json({ error: message }, { status: result.status })
      }

      const respData = result.body as Record<string, unknown>
      const token = respData?.token as string
      const customer = respData?.customer as Record<string, unknown> ?? {}

      if (!token) {
        return NextResponse.json(
          { error: 'Registration failed — no token returned.' },
          { status: 500 }
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

    // ── Fallback: local SQLite registration (legacy) ──
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role: 'PATIENT',
      },
    })

    const jwt = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, fullName: user.fullName },
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
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
