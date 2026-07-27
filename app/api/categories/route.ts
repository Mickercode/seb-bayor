import { NextResponse } from 'next/server'
import { proxy, toSebCategoryList } from '@/lib/conddo-proxy'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await proxy('GET', '/inventory/categories')

    if (result.status >= 400) {
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: result.status },
      )
    }

    const transformed = toSebCategoryList(result.body)
    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Get categories proxy error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
