import { NextRequest, NextResponse } from 'next/server'
import { proxy, toSebProductList } from '@/lib/conddo-proxy'
import { getAdminToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// List all products (admin) — proxied to Conddo
export async function GET() {
  try {
    const token = await getAdminToken()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await proxy('GET', '/inventory/products?size=200', undefined, token)
    if (result.status >= 400) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: result.status })
    }

    const transformed = toSebProductList(result.body)
    return NextResponse.json({ products: transformed.products })
  } catch (error) {
    console.error('Admin get products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// Create a new product — proxied to Conddo
export async function POST(request: NextRequest) {
  try {
    const token = await getAdminToken()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      nameGeneric, nameBrand, slug, description,
      indications, dosageGuidance, warnings, storage,
      price, categoryId, requiresPrescription, stockQty,
      nafdacNumber, brand, isActive,
    } = body

    if (!nameGeneric || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Map SebBayor fields → Conddo product fields
    const conddoBody: Record<string, unknown> = {
      name: nameGeneric,
      nameBrand: nameBrand || null,
      nameGeneric: nameGeneric,
      slug: slug || nameGeneric.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      indications: indications || null,
      dosageGuidance: dosageGuidance || null,
      warnings: warnings || null,
      storage: storage || null,
      price: Number(price),
      categoryId,
      requiresPrescription: requiresPrescription || false,
      stock: Number(stockQty || 0),
      nafdacNumber: nafdacNumber || null,
      brand: brand || null,
      active: isActive ?? true,
    }

    const result = await proxy('POST', '/inventory/products', conddoBody, token)

    if (result.status >= 400) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: result.status }
      )
    }

    const created = toSebProductList(result.body)
    return NextResponse.json({ success: true, product: created.products[0] })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
