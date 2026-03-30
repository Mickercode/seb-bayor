import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// List all articles (admin)
export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const articles = await prisma.article.findMany({
      include: { author: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Get articles error:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

// Create article
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, category, isPublished } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }

    const existing = await prisma.article.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'An article with this slug already exists' }, { status: 400 })
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        category: category || 'News',
        authorId: session.userId,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true, article })
  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
