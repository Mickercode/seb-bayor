import { cookies } from 'next/headers'
import { verifyToken, type JwtPayload } from './auth'

export async function getAdminSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  // Only return session if role is ADMIN or PHARMACIST
  if (!['ADMIN', 'PHARMACIST'].includes(payload.role)) return null

  return payload
}
