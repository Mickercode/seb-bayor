import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const TOKEN_EXPIRY = '7d'

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth(): Promise<JwtPayload> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function requireRole(role: string): Promise<JwtPayload> {
  const session = await requireAuth()
  if (session.role !== role && session.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }
  return session
}
