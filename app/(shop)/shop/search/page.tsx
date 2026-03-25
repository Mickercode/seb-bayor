import { Metadata } from 'next'
import Link from 'next/link'
import { Search, ShoppingCart, MessageCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'

type Props = {
  searchParams: { q?: string }
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const query = searchParams.q || ''
  return {
    title: query
      ? `Search results for "${query}" — AnythingDrugs Shop`
      : 'Search — AnythingDrugs Shop',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const query = (searchParams.q || '').trim()

  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = []

  if (query) {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { nameGeneric: { contains: query } },
          { nameBrand: { contains: query } },
        ],
      },
      orderBy: { nameGeneric: 'asc' },
    })
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I searched for "${query}" on AnythingDrugs but couldn't find what I need. Can you help?`
  )

  return (
    <div className="section-padding">
      <div className="container-max">
        {/* Search Form */}
        <form action="/shop/search" method="GET" className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search medicines, brands, health products..."
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {query ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {products.length} result{products.length !== 1 ? 's' : ''} for{' '}
              <span className="font-semibold text-gray-900">&ldquo;{query}&rdquo;</span>
            </p>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-2">
                  No products found for &ldquo;{query}&rdquo;.
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Can&apos;t find what you need? Our pharmacists can help.
                </p>
                <a
                  href={`https://wa.me/234XXXXXXXXXX?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-mint-500 hover:bg-mint-600 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-colors"
                >
                  <MessageCircle size={18} />
                  Speak to a Pharmacist
                </a>
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
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              Enter a search term to find medications and health products.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
