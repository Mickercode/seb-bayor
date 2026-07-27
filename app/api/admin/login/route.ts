import { NextResponse } from 'next/server'
import { CONDDO_API } from '@/lib/conddo-proxy'

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

    // Conddo's auth endpoint is at /auth/login, not under /api/v1/
    const tenantSlug = process.env.CONDDO_TENANT_SLUG || ''
    if (!tenantSlug) {
      return NextResponse.json(
        { error: 'Tenant not configured' },
        { status: 500 }
      )
    }

    const res = await fetch(`${CONDDO_API}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tenantSlug, email, password }),
    })

    const respBody = await res.json()

    if (res.status >= 400) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      )
    }

    // Conddo returns { data: { accessToken, userId, role, ... } }
    const d = (respBody as Record<string, unknown>)?.data as Record<string, unknown> ?? {}
    const accessToken = d.accessToken as string
    const userId = d.userId as string
    const role = d.role as string

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        fullName: email,
        role: role || 'TENANT_ADMIN',
      },
    })

    // Store Conddo's JWT as the admin_token cookie
    response.cookies.set('admin_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Admin login proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
