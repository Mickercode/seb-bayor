import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, SlidersHorizontal } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

const PRODUCTS_PER_PAGE = 20

type Props = {
  params: { category: string }
  searchParams: { sort?: string; page?: string; rx?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  })
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `${category.name} — AnythingDrugs Shop`,
    description: `Browse ${category.name} products on AnythingDrugs by Seb & Bayor Pharmaceutical Ltd.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  })

  if (!category) notFound()

  const page = Math.max(1, parseInt(searchParams.page || '1', 10))
  const skip = (page - 1) * PRODUCTS_PER_PAGE

  // Build where clause
  const where: Record<string, unknown> = {
    categoryId: category.id,
    isActive: true,
  }
  if (searchParams.rx === '1') {
    where.requiresPrescription = true
  }

  // Build orderBy
  let orderBy: Record<string, string> = {}
  switch (searchParams.sort) {
    case 'price-asc':
      orderBy = { price: 'asc' }
      break
    case 'price-desc':
      orderBy = { price: 'desc' }
      break
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    default:
      orderBy = { nameGeneric: 'asc' }
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE)

  // Fetch price range for filter sidebar
  const priceAgg = await prisma.product.aggregate({
    where: { categoryId: category.id, isActive: true },
    _min: { price: true },
    _max: { price: true },
  })

  const basePath = `/shop/${params.category}`
  const currentSort = searchParams.sort || ''
  const currentRx = searchParams.rx || ''

  function buildUrl(overrides: Record<string, string>) {
    const p: Record<string, string> = {}
    if (currentSort) p.sort = currentSort
    if (currentRx) p.rx = currentRx
    Object.assign(p, overrides)
    // Remove empty values
    Object.keys(p).forEach((k) => {
      if (!p[k]) delete p[k]
    })
    const qs = new URLSearchParams(p).toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  return (
    <div className="section-padding">
      <div className="container-max">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-mint-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </Link>

        {/* Page title */}
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-8">
          {category.name}
        </h1>

        <div className="flex gap-8">
          {/* ===== Filter Sidebar (desktop only) ===== */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
                <SlidersHorizontal size={18} />
                Filters
              </div>

              {/* Price Range */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h3>
                {priceAgg._min.price !== null && priceAgg._max.price !== null ? (
                  <p className="text-sm text-gray-500">
                    {`₦${priceAgg._min.price.toLocaleString()}`} &mdash;{' '}
                    {`₦${priceAgg._max.price.toLocaleString()}`}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">No products</p>
                )}
              </div>

              {/* Prescription Filter */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Prescription Required
                </h3>
                {currentRx === '1' ? (
                  <Link
                    href={buildUrl({ rx: '' })}
                    className="text-sm text-mint-600 hover:text-mint-700 font-medium"
                  >
                    Showing Rx Only &mdash; Clear
                  </Link>
                ) : (
                  <Link
                    href={buildUrl({ rx: '1', page: '' })}
                    className="text-sm text-gray-600 hover:text-mint-600"
                  >
                    Show Prescription Only
                  </Link>
                )}
              </div>
            </div>
          </aside>

          {/* ===== Main Content ===== */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm border-b border-gray-200 pb-4">
              <span className="text-gray-500 mr-2">Sort by:</span>
              {[
                { label: 'Relevance', value: '' },
                { label: 'Price: Low\u2013High', value: 'price-asc' },
                { label: 'Price: High\u2013Low', value: 'price-desc' },
                { label: 'Newest', value: 'newest' },
              ].map(({ label, value }) => (
                <Link
                  key={value}
                  href={buildUrl({ sort: value, page: '' })}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    currentSort === value
                      ? 'bg-mint-500 text-white font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-mint-100 hover:text-mint-700'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-4">
              {totalCount} product{totalCount !== 1 ? 's' : ''} found
            </p>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found in this category.</p>
                <Link href="/shop" className="text-mint-600 hover:text-mint-700 mt-4 inline-block text-sm font-medium">
                  Browse all categories
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    {/* Image placeholder */}
                    <Link href={`/shop/product/${product.slug}`}>
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-300 text-xs">Image</span>
                      </div>
                    </Link>

                    <div className="p-3 md:p-4">
                      {/* Rx badge */}
                      {product.requiresPrescription && (
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-red-100 text-red-700 px-2 py-0.5 rounded mb-2">
                          Rx Required
                        </span>
                      )}

                      <Link href={`/shop/product/${product.slug}`}>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-mint-600 transition-colors line-clamp-2">
                          {product.nameGeneric}
                        </h3>
                      </Link>

                      {product.nameBrand && (
                        <p className="text-xs text-gray-400 mt-0.5">{product.nameBrand}</p>
                      )}

                      <p className="text-base font-bold text-gray-900 mt-2">
                        {`₦${product.price.toLocaleString()}`}
                      </p>

                      <button
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-10">
                {page > 1 && (
                  <Link
                    href={buildUrl({ page: String(page - 1) })}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildUrl({ page: String(p) })}
                    className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${
                      p === page
                        ? 'bg-mint-500 text-white font-bold'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </Link>
                ))}

                {page < totalPages && (
                  <Link
                    href={buildUrl({ page: String(page + 1) })}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
