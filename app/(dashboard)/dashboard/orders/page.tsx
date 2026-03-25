import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Eye, RotateCcw } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  RX_REVIEW: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-teal-100 text-teal-700',
  DISPATCHED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: {
      _count: {
        select: { items: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order._count.items} item{order._count.items !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-gray-900">
                    ₦{order.total.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
