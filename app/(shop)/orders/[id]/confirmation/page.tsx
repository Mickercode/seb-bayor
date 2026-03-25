import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CheckCircle, Package, ClipboardCheck, Truck, Home, ShoppingBag, MessageCircle } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function OrderConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      address: true,
    },
  })

  if (!order) return notFound()

  const statusSteps = [
    { key: 'PENDING', label: 'Order Placed', icon: <Package size={18} /> },
    { key: 'RX_REVIEW', label: 'Pharmacist Review', icon: <ClipboardCheck size={18} /> },
    { key: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircle size={18} /> },
    { key: 'DISPATCHED', label: 'Dispatched', icon: <Truck size={18} /> },
    { key: 'DELIVERED', label: 'Delivered', icon: <Home size={18} /> },
  ]

  const currentIndex = statusSteps.findIndex((s) => s.key === order.status)

  return (
    <div className="section-padding bg-gray-50 min-h-screen" data-zone="shop">
      <div className="container-max max-w-2xl">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle size={36} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Your order <span className="font-mono font-bold">{order.id.slice(0, 8).toUpperCase()}</span> has been received.
          </p>
        </div>

        {/* Status timeline */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="font-bold mb-4">Order Status</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    i <= currentIndex
                      ? 'bg-mint-500 text-black'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <span className={`text-xs text-center ${
                  i <= currentIndex ? 'text-gray-900 font-medium' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order details */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="font-bold mb-4">Order Details</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.product.nameGeneric}</span>
                  {item.product.nameBrand && (
                    <span className="text-gray-500 ml-1">({item.product.nameBrand})</span>
                  )}
                  <span className="text-gray-500"> × {item.quantity}</span>
                </div>
                <span>₦{(item.unitPrice * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span>₦{order.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>Total</span>
              <span>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        {order.address && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="font-bold mb-2">Delivery Address</h2>
            <p className="text-sm text-gray-600">
              {order.address.street}, {order.address.city}, {order.address.state}
              {order.address.landmark && ` (Near ${order.address.landmark})`}
            </p>
          </div>
        )}

        {/* WhatsApp notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-800">
          <p className="font-semibold flex items-center gap-2">
            <MessageCircle size={16} /> We&apos;ll update you on WhatsApp
          </p>
          <p className="mt-1">
            Order updates will be sent to your registered phone number via WhatsApp.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/orders" className="btn-accent flex-1 text-center py-3">
            Track Order
          </Link>
          <Link href="/shop" className="btn-outline flex-1 text-center py-3 flex items-center justify-center gap-2">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
