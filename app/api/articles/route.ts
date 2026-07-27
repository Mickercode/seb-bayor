import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Public: list published articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      include: { author: { select: { fullName: true } } },
      orderBy: { publishedAt: 'desc' },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Get articles error:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}
