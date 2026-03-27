import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, MapPin, FileText, Clock } from 'lucide-react'
import OrderStatusUpdate from '@/components/admin/order-status-update'

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  RX_REVIEW: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-teal-100 text-teal-700',
  DISPATCHED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const paymentStatusColors: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  FAILED: 'bg-red-100 text-red-700',
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true } },
      address: true,
      items: {
        include: {
          product: {
            select: { nameGeneric: true, nameBrand: true, slug: true },
          },
        },
      },
      prescriptions: {
        include: {
          pharmacist: { select: { fullName: true } },
        },
      },
    },
  })

  if (!order) notFound()

  return (
    <div className="py-6">
      {/* Back link */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Clock className="w-4 h-4" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[order.status] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {order.status.replace('_', ' ')}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-700'
            }`}
          >
            Payment: {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => {
                const snapshot = JSON.parse(item.snapshot || '{}')
                return (
                  <div key={item.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {item.product?.nameGeneric || snapshot.nameGeneric || 'Unknown'}
                      </p>
                      {(item.product?.nameBrand || snapshot.nameBrand) && (
                        <p className="text-sm text-gray-500">
                          {item.product?.nameBrand || snapshot.nameBrand}
                        </p>
                      )}
                      <p className="text-sm text-gray-400 mt-0.5">
                        {formatCurrency(item.unitPrice)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 ml-4">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="px-5 py-4 bg-gray-50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Prescriptions */}
          {order.prescriptions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Prescriptions
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {order.prescriptions.map((rx) => (
                  <div key={rx.id} className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[rx.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {rx.status}
                      </span>
                      {rx.pharmacist && (
                        <span className="text-xs text-gray-400">
                          Reviewed by {rx.pharmacist.fullName}
                        </span>
                      )}
                    </div>
                    {rx.patientName && (
                      <p className="text-sm text-gray-600">Patient: {rx.patientName}</p>
                    )}
                    {rx.prescriberName && (
                      <p className="text-sm text-gray-600">Prescriber: {rx.prescriberName}</p>
                    )}
                    {rx.fileUrl && (
                      <a
                        href={rx.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-sm text-teal-600 hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        View file
                      </a>
                    )}
                    {rx.reviewNote && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        <span className="font-medium">Note:</span> {rx.reviewNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-2">Customer Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Update Status</h2>
            <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
          </div>

          {/* Customer info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{order.user.fullName}</p>
              <p className="text-gray-600">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-gray-600">{order.user.phone}</p>
              )}
            </div>
          </div>

          {/* Delivery address */}
          {order.address && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.address.label}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state}</p>
                {order.address.landmark && (
                  <p className="text-gray-400">Near {order.address.landmark}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
