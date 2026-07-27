/**
 * Admin auth helper — reads Conddo's tenant JWT from the admin_token cookie.
 *
 * Unlike the previous SebBayor implementation that verified its own JWT,
 * the proxy approach stores Conddo's JWT in the admin_token cookie.
 * Conddo's backend verifies the token on each proxied request.
 *
 * For routes that need the raw token (to pass to the proxy), use getAdminToken().
 * For routes that need user info (UI rendering), use getAdminSession().
 */

import { cookies } from 'next/headers'

/**
 * Decode JWT payload without verifying the signature.
 * The payload is base64-encoded JSON — safe to decode client-side
 * for extracting claims like userId and role.
 */
function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

/**
 * Returns the raw Conddo JWT from the admin_token cookie, or null if missing.
 */
export async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value ?? null
}

/**
 * Reads the admin_token cookie and decodes the Conddo JWT payload
 * to extract userId, email, and role. Returns null when the token
 * is missing or malformed.
 *
 * NOTE: The role claim comes from Conddo's JWT which uses values like
 * 'TENANT_ADMIN', 'STAFF', or 'SUPER_ADMIN' — not SebBayor's legacy
 * 'ADMIN' / 'PHARMACIST'. The proxy middleware accepts both sets.
 */
export async function getAdminSession(): Promise<{ userId: string; email: string; role: string } | null> {
  const token = await getAdminToken()
  if (!token) return null

  const payload = decodePayload(token)
  if (!payload) return null

  return {
    userId: (payload.sub as string) ?? '',
    email: (payload.email as string) ?? '',
    role: (payload.role as string) ?? '',
  }
}
