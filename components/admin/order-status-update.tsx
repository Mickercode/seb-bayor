'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'text-gray-700' },
  { value: 'RX_REVIEW', label: 'Rx Review', color: 'text-amber-700' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'text-teal-700' },
  { value: 'DISPATCHED', label: 'Dispatched', color: 'text-blue-700' },
  { value: 'DELIVERED', label: 'Delivered', color: 'text-green-700' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'text-red-700' },
]

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleUpdate() {
    if (status === currentStatus) return

    setLoading(true)
    setSuccess(false)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 2000)
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {success ? 'Updated!' : 'Update Status'}
      </button>
    </div>
  )
}
