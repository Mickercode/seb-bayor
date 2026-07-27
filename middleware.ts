import { NextRequest, NextResponse } from 'next/server'

// Lightweight JWT decode (no verification — Conddo's backend verifies on each API call)
function decodeToken(token: string): { userId?: string; email?: string; role?: string } | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── Dashboard routes: require customer token ───
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value
    if (!token || !decodeToken(token)) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ─── Admin routes: Conddo JWT or SebBayor legacy token ───
  // Conddo uses 'TENANT_ADMIN' / 'STAFF' roles; SebBayor used 'ADMIN' / 'PHARMACIST'.
  const ADMIN_ROLES = new Set(['TENANT_ADMIN', 'STAFF', 'SUPER_ADMIN', 'ADMIN', 'PHARMACIST'])

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('admin_token')?.value
    const session = adminToken ? decodeToken(adminToken) : null
    if (!session || !ADMIN_ROLES.has(session.role ?? '')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Admin login — redirect to dashboard if already authenticated
  if (pathname === '/admin/login') {
    const adminToken = request.cookies.get('admin_token')?.value
    const session = adminToken ? decodeToken(adminToken) : null
    if (session && ADMIN_ROLES.has(session.role ?? '')) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // Auth pages — redirect if already logged in
  if (pathname.startsWith('/auth')) {
    const token = request.cookies.get('token')?.value
    if (token && decodeToken(token)) {
      return NextResponse.redirect(new URL('/shop', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/auth/:path*'],
}
