import { NextResponse } from 'next/server'
import { getAdminToken } from '@/lib/admin-auth'
import { migrateAllProductImages, getImageCacheStats } from '@/lib/image-migration'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const token = await getAdminToken()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const stats = await migrateAllProductImages(token)
    return NextResponse.json({ success: true, message: 'Image migration completed', stats })
  } catch (error) {
    console.error('Image migration error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Migration failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const token = await getAdminToken()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const stats = getImageCacheStats()
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Get migration stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
