import { NextRequest, NextResponse } from 'next/server'
import { proxy } from '@/lib/conddo-proxy'
import { getAdminToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = await getAdminToken()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('status')

    let path = '/orders?size=100'
    if (stage) path += `&stage=${encodeURIComponent(stage)}`

    const result = await proxy('GET', path, undefined, token)

    if (result.status >= 400) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: result.status })
    }

    // Transform Conddo order shape to SebBayor format
    const body = result.body as Record<string, unknown> | null
    const items = (body?.data ?? []) as Record<string, unknown>[]
    const orders = items.map((o) => ({
      id: o.id,
      reference: o.reference,
      customerName: o.customerName,
      service: o.service,
      stage: o.stage,
      amount: o.amount,
      createdAt: o.createdAt,
      itemCount: (o.items as unknown[])?.length ?? 0,
    }))

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Admin get orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
