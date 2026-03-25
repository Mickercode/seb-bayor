import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Search, ShieldCheck, Truck, ClipboardCheck } from 'lucide-react'

const categoryImages: Record<string, string> = {
  prescription: '/categories/prescription.jpg',
  otc: '/categories/otc.jpg',
  vitamins: '/categories/vitamins.jpg',
  'personal-care': '/categories/personal-care.jpg',
  'baby-care': '/categories/baby-care.jpg',
  'medical-devices': '/categories/medical-devices.jpg',
}

function formatPrice(amount: number): string {
  return '\u20A6' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })
}

export default async function ShopHomePage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    take: 6,
    orderBy: { name: 'asc' },
  })

  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="bg-gray-50 section-padding">
        <div className="container-max text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Order Your Medications &amp; Health Products Online
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Fast, reliable, pharmacist-verified &mdash; delivered to your door.
          </p>

          {/* Search bar */}
          <form action="/shop/search" method="get" className="max-w-xl mx-auto mb-8">
            <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden bg-white focus-within:border-[var(--color-primary)] transition-colors">
              <input
                type="text"
                name="q"
                placeholder="Search medications, vitamins, health products..."
                className="flex-1 px-5 py-3 text-sm outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-3 transition-colors"
                style={{ color: 'var(--color-primary)' }}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="btn-primary text-sm px-8 py-3">
              Shop Now
            </Link>
            <Link href="/prescription/upload" className="btn-outline text-sm px-8 py-3">
              Upload Prescription
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      {categories.length > 0 && (
        <section className="section-padding">
          <div className="container-max">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {categories.map((category) => {
                const imageSrc = categoryImages[category.slug] || '/categories/prescription.jpg'
                return (
                  <Link
                    key={category.id}
                    href={`/shop/${category.slug}`}
                    className="group relative overflow-hidden rounded-xl min-h-[160px] md:min-h-[200px] hover:scale-[1.02] transition-transform"
                  >
                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-4 left-4 right-4 text-sm md:text-base font-bold text-white drop-shadow-lg">
                      {category.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="bg-gray-50 section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: 1,
                icon: Search,
                title: 'Search for your medication',
                desc: 'Browse our catalogue or search by name, condition, or category.',
              },
              {
                step: 2,
                icon: ClipboardCheck,
                title: 'Pharmacist reviews your order',
                desc: 'A licensed pharmacist verifies every order before dispatch.',
              },
              {
                step: 3,
                icon: Truck,
                title: 'Delivered to your door',
                desc: 'Receive your medications quickly, securely, and discreetly.',
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-xl font-bold"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
                >
                  {item.step}
                </div>
                <item.icon size={28} className="text-gray-400 mb-3" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED PRODUCTS ===================== */}
      {featuredProducts.length > 0 && (
        <section className="section-padding">
          <div className="container-max">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <Link
                href="/shop"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Image placeholder */}
                  <Link href={`/shop/product/${product.slug}`} className="block">
                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-400">No image</span>
                      {product.requiresPrescription && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Rx
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    <Link href={`/shop/product/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5 line-clamp-2">
                        {product.nameGeneric}
                      </h3>
                      {product.nameBrand && (
                        <p className="text-xs text-gray-500 mb-2">{product.nameBrand}</p>
                      )}
                    </Link>
                    <p className="text-base font-bold text-gray-900 mt-auto mb-3">
                      {formatPrice(product.price)}
                    </p>
                    <button className="btn-primary text-xs w-full py-2">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== TRUST BANNER ===================== */}
      <section
        className="py-6 border-t border-b border-gray-100"
        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
      >
        <div className="container-max">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 text-sm font-semibold text-center">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} />
              Pharmacist-verified orders
            </span>
            <span className="hidden md:inline" aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} />
              Secure checkout
            </span>
            <span className="hidden md:inline" aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-2">
              <Truck size={18} />
              Fast delivery
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
