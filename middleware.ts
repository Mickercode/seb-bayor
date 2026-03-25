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
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/auth')
  const isAdminPage = pathname.startsWith('/admin')
  const isDashboardPage = pathname.startsWith('/dashboard')

  const session = token ? decodeToken(token) : null

  // Logged-in users visiting auth pages → redirect based on role
  if (isAuthPage && session) {
    const dest = ['ADMIN', 'PHARMACIST'].includes(session.role) ? '/admin' : '/shop'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Protected routes without session → redirect to login
  if ((isAdminPage || isDashboardPage) && !session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin pages require ADMIN or PHARMACIST role
  if (isAdminPage && session && !['ADMIN', 'PHARMACIST'].includes(session.role)) {
    return NextResponse.redirect(new URL('/dashboard/orders', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/auth/:path*'],
}
