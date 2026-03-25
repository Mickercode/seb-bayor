import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Eye } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  RX_REVIEW: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-teal-100 text-teal-700',
  DISPATCHED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const paymentStatusColors: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  FAILED: 'bg-red-100 text-red-700',
};

const statusTabs = ['All', 'PENDING', 'CONFIRMED', 'DISPATCHED', 'DELIVERED'];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await getSession();
  if (!session || !['PHARMACIST', 'ADMIN'].includes(session.role)) {
    redirect('/auth/login');
  }

  const activeStatus = searchParams.status || 'All';

  const where = activeStatus !== 'All' ? { status: activeStatus } : {};

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: {
        select: { fullName: true, email: true },
      },
      _count: {
        select: { items: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h1>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statusTabs.map((tab) => (
          <Link
            key={tab}
            href={`/admin/orders${tab === 'All' ? '' : `?status=${tab}`}`}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeStatus === tab
                ? 'bg-teal-700 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab === 'All' ? 'All Orders' : tab.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Order #
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Items
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Payment
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {order.user.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{order.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order._count.items}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      ₦{order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          paymentStatusColors[order.paymentStatus || ''] ||
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.paymentStatus || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-800 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
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
                <p className="text-sm text-gray-600">{order.user.fullName}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)} &middot; {order._count.items} items
                  </p>
                  <p className="font-bold text-gray-900">
                    ₦{order.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      paymentStatusColors[order.paymentStatus || ''] ||
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.paymentStatus || 'N/A'}
                  </span>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-800 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
