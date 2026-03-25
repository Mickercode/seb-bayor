import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  FileText,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Package,
} from 'lucide-react';

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || !['PHARMACIST', 'ADMIN'].includes(session.role)) {
    redirect('/auth/login');
  }

  // Fetch stats in parallel
  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    totalRevenue,
    pendingPrescriptions,
    totalUsers,
    totalProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'CONFIRMED' } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
    prisma.prescription.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { role: 'PATIENT' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true } },
        _count: { select: { items: true } },
      },
    }),
  ]);

  const revenue = totalRevenue._sum.total || 0;

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(revenue),
      icon: TrendingUp,
      color: 'bg-green-50 text-green-700',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700',
      iconColor: 'text-amber-600',
      href: '/admin/orders?status=PENDING',
    },
    {
      label: 'Rx Pending Review',
      value: pendingPrescriptions,
      icon: AlertCircle,
      color: 'bg-red-50 text-red-700',
      iconColor: 'text-red-600',
      href: '/admin/prescriptions',
    },
    {
      label: 'Customers',
      value: totalUsers,
      icon: Users,
      color: 'bg-purple-50 text-purple-700',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Active Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-teal-50 text-teal-700',
      iconColor: 'text-teal-600',
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-700',
    CONFIRMED: 'bg-teal-100 text-teal-700',
    DISPATCHED: 'bg-blue-100 text-blue-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {session.email}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );

          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </div>

      {/* Quick actions */}
      {(pendingOrders > 0 || pendingPrescriptions > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-amber-800 mb-3">Needs Attention</h2>
          <div className="flex flex-wrap gap-3">
            {pendingOrders > 0 && (
              <Link
                href="/admin/orders?status=PENDING"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 rounded-lg text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
              >
                <Clock className="w-4 h-4" />
                {pendingOrders} pending order{pendingOrders !== 1 ? 's' : ''}
              </Link>
            )}
            {pendingPrescriptions > 0 && (
              <Link
                href="/admin/prescriptions"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 rounded-lg text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
              >
                <FileText className="w-4 h-4" />
                {pendingPrescriptions} prescription{pendingPrescriptions !== 1 ? 's' : ''} to review
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-teal-700 hover:text-teal-800 font-medium"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {order.user.fullName} &middot; {order._count.items} item{order._count.items !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
