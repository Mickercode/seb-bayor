import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import ProductToggle from '@/components/admin/product-toggle'

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  const where = searchParams.category
    ? { category: { slug: searchParams.category } }
    : {}

  const products = await prisma.product.findMany({
    where,
    include: {
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Link
          href="/admin/products"
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            !searchParams.category
              ? 'bg-teal-700 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All ({products.length})
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/products?category=${cat.slug}`}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              searchParams.category === cat.slug
                ? 'bg-teal-700 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Rx
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {product.nameGeneric}
                      </p>
                      {product.nameBrand && (
                        <p className="text-xs text-gray-500">{product.nameBrand}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          product.stockQty === 0
                            ? 'text-red-600'
                            : product.stockQty <= 10
                            ? 'text-amber-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {product.stockQty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.requiresPrescription ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ProductToggle
                        productId={product.id}
                        isActive={product.isActive}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-800 font-medium"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.nameGeneric}</p>
                    {product.nameBrand && (
                      <p className="text-xs text-gray-500">{product.nameBrand}</p>
                    )}
                  </div>
                  <ProductToggle
                    productId={product.id}
                    isActive={product.isActive}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{product.category.name}</span>
                  <span className="font-bold">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Stock: {product.stockQty}
                    {product.requiresPrescription && ' · Rx required'}
                  </span>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-sm text-teal-700 font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
