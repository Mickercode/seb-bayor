import { NextRequest, NextResponse } from 'next/server'
import { proxy, toSebProductList } from '@/lib/conddo-proxy'
import { getBestProductImage } from '@/lib/image-migration'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params
    // Conddo's inventory detail endpoint works by UUID or slug via search
    const result = await proxy('GET', `/inventory/products?search=${encodeURIComponent(slug)}&size=1`)

    if (result.status >= 400) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 },
      )
    }

    const list = toSebProductList(result.body)
    const product = list.products[0] as Record<string, unknown> | undefined
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 },
      )
    }

    // Migrate the first product image from Conddo Cloudinary to SebBayor Cloudinary
    const migratedImage = await getBestProductImage(product.images)
    if (migratedImage) {
      product.displayImage = migratedImage
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Get product proxy error:', error)
    return NextResponse.json({ error: 'Product not found' }, { status: 500 })
  }
}
