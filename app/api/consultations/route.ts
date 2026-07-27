import { NextResponse } from 'next/server'
import { publicProxy, hasSiteKey } from '@/lib/conddo-proxy'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/consultations
 *
 * Customer consultation request from the SebBayor website.
 * If CONDDO_SITE_KEY is set, proxies to Conddo's public consultation API.
 * Otherwise falls back to local SQLite (legacy).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { whatsappNumber, topic, customerName } = body

    if (!whatsappNumber || !topic) {
      return NextResponse.json(
        { error: 'WhatsApp number and topic are required.' },
        { status: 400 }
      )
    }

    // ── If site key configured, proxy to Conddo ──
    if (hasSiteKey) {
      const result = await publicProxy('POST', '/pharmacy/consultations', {
        customerName: customerName || 'Website Visitor',
        whatsappNumber,
        topic,
      })

      if (result.status >= 400) {
        console.error('Consultation proxy error:', result.status, result.body)
        return NextResponse.json(
          { error: 'Failed to submit consultation request.' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    // ── Fallback: local SQLite (legacy) ──
    await prisma.consultation.create({
      data: {
        whatsappNumber,
        topic,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Consultation error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
