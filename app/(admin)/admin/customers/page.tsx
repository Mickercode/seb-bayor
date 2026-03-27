import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { Users, Mail, Phone, ShoppingBag, Search } from 'lucide-react'

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const searchQuery = searchParams.q || ''

  const where = searchQuery
    ? {
        role: 'PATIENT' as const,
        OR: [
          { fullName: { contains: searchQuery } },
          { email: { contains: searchQuery } },
          { phone: { contains: searchQuery } },
        ],
      }
    : { role: 'PATIENT' as const }

  const customers = await prisma.user.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: {
        select: { orders: true, prescriptions: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Customers
        </h1>
        <span className="text-sm text-gray-500">{customers.length} total</span>
      </div>

      {/* Search */}
      <form action="/admin/customers" method="get" className="mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white max-w-md focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by name, email, or phone..."
            className="flex-1 px-4 py-2.5 text-sm outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 text-gray-500 hover:text-teal-700"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {customers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery ? 'No customers match your search' : 'No customers yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Contact
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Joined
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Orders
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Prescriptions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {customer.fullName}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {customer.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {customer._count.orders}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {customer._count.prescriptions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {customers.map((customer) => (
              <div key={customer.id} className="p-4 space-y-2">
                <p className="font-medium text-gray-900">{customer.fullName}</p>
                <p className="text-sm text-gray-600">{customer.email}</p>
                {customer.phone && (
                  <p className="text-sm text-gray-500">{customer.phone}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Joined {formatDate(customer.createdAt)}</span>
                  <span>{customer._count.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
