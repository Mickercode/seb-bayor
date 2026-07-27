import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { hashPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// List admin/pharmacist users (ADMIN only)
export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'PHARMACIST'] } },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get admin users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// Create a new admin/pharmacist user (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only super admins can create staff accounts' }, { status: 403 })
    }

    const body = await request.json()
    const { fullName, email, phone, password, role } = body

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    if (!['ADMIN', 'PHARMACIST'].includes(role)) {
      return NextResponse.json({ error: 'Role must be ADMIN or PHARMACIST' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Create admin user error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
