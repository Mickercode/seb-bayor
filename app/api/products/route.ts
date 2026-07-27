import { NextRequest, NextResponse } from 'next/server'
import { proxy, toSebProductList } from '@/lib/conddo-proxy'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const q = searchParams.get('q')
    const featured = searchParams.get('featured')

    // Build query params for Conddo's inventory API
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (q) params.set('search', q)
    if (featured) { params.set('size', '8') }
    if (!params.has('size')) params.set('size', '50')

    const qs = params.toString()
    const result = await proxy('GET', `/inventory/products${qs ? '?' + qs : ''}`)

    if (result.status >= 400) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: result.status },
      )
    }

    // Transform Conddo's response shape → SebBayor shape
    const transformed = toSebProductList(result.body)
    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Get products proxy error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
