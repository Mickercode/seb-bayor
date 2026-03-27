import { NextRequest, NextResponse } from 'next/server'

// Lightweight JWT decode (no verification — server layouts handle full auth)
function decodeToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // ─── Subdomain detection ───
  // Matches: admin.domain.com, admin.localhost:3000, etc.
  const isAdminSubdomain =
    hostname.startsWith('admin.') ||
    hostname.startsWith('admin-')

  // If on admin subdomain, rewrite all non-admin paths to /admin/*
  if (isAdminSubdomain) {
    // Already on an /admin path — let it through
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      // continue to auth checks below
    } else if (pathname.startsWith('/api/')) {
      // Block customer API routes from admin subdomain
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    } else if (pathname === '/') {
      // Root of admin subdomain → /admin
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      // Block customer pages on admin subdomain
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // ─── Admin routes auth (separate cookie: admin_token) ───
  const isAdminLogin = pathname === '/admin/login'
  const isAdminPage = pathname.startsWith('/admin')

  if (isAdminPage) {
    const adminToken = request.cookies.get('admin_token')?.value
    const adminSession = adminToken ? decodeToken(adminToken) : null

    // Already logged in and visiting login page → go to dashboard
    if (isAdminLogin && adminSession && ['ADMIN', 'PHARMACIST'].includes(adminSession.role)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Not logged in and not on login page → go to admin login
    if (!isAdminLogin && !adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Logged in but wrong role → go to admin login
    if (!isAdminLogin && adminSession && !['ADMIN', 'PHARMACIST'].includes(adminSession.role)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Set pathname header for the layout to detect login page
    const response = NextResponse.next()
    response.headers.set('x-next-pathname', pathname)
    return response
  }

  // ─── Customer routes auth (cookie: token) ───
  const token = request.cookies.get('token')?.value
  const session = token ? decodeToken(token) : null

  const isAuthPage = pathname.startsWith('/auth')
  const isDashboardPage = pathname.startsWith('/dashboard')

  // Logged-in customers visiting auth pages → redirect to shop
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/shop', request.url))
  }

  // Protected customer routes without session → redirect to customer login
  if (isDashboardPage && !session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/auth/:path*'],
}
