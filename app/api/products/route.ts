import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const q = searchParams.get('q')
    const featured = searchParams.get('featured')

    const where: any = { isActive: true }

    if (category) {
      where.category = { slug: category }
    }

    if (q) {
      where.OR = [
        { nameGeneric: { contains: q } },
        { nameBrand: { contains: q } },
        { description: { contains: q } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      ...(featured ? { take: 8 } : {}),
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
