import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// List all products (admin)
export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// Create a new product
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      nameGeneric,
      nameBrand,
      slug,
      description,
      indications,
      dosageGuidance,
      warnings,
      storage,
      price,
      categoryId,
      requiresPrescription,
      stockQty,
      nafdacNumber,
      brand,
      isActive,
    } = body

    if (!nameGeneric || !slug || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        nameGeneric,
        nameBrand: nameBrand || null,
        slug,
        description,
        indications: indications || null,
        dosageGuidance: dosageGuidance || null,
        warnings: warnings || null,
        storage: storage || null,
        price,
        categoryId,
        requiresPrescription: requiresPrescription || false,
        stockQty: stockQty || 0,
        nafdacNumber: nafdacNumber || null,
        brand: brand || null,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
