import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, ShieldAlert, MessageCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductTabs } from '@/components/shop/product-tabs'
import { AddToCart } from '@/components/shop/add-to-cart'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.nameGeneric} — AnythingDrugs Shop`,
    description: product.description?.slice(0, 160) || `Buy ${product.nameGeneric} online at AnythingDrugs.`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  })

  if (!product || !product.isActive) notFound()

  // Related products from same category (excluding current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    take: 4,
  })

  const whatsappMessage = encodeURIComponent(
    `Hello, I'd like to enquire about "${product.nameGeneric}" on AnythingDrugs.`
  )

  const tabs = [
    { label: 'Description', key: 'description', content: product.description },
    { label: 'Indications', key: 'indications', content: product.indications },
    { label: 'Dosage', key: 'dosage', content: product.dosageGuidance },
    { label: 'Warnings', key: 'warnings', content: product.warnings },
    { label: 'Storage', key: 'storage', content: product.storage },
  ]

  return (
    <div className="section-padding">
      <div className="container-max">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8 flex-wrap">
          <Link href="/shop" className="hover:text-mint-600 transition-colors">
            Shop
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/shop/${product.category.slug}`}
            className="hover:text-mint-600 transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-none">
            {product.nameGeneric}
          </span>
        </nav>

        {/* ===== Two-column layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div>
            {/* Main image placeholder */}
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-300 text-sm">Product Image</span>
            </div>
            {/* Thumbnail placeholders */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-md flex items-center justify-center shrink-0"
                >
                  <span className="text-gray-300 text-[10px]">{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-1">
              {product.nameGeneric}
            </h1>

            {product.nameBrand && (
              <p className="text-sm text-gray-400 mb-4">{product.nameBrand}</p>
            )}

            <p className="text-3xl font-bold text-gray-900 mb-4">
              {`₦${product.price.toLocaleString()}`}
            </p>

            {/* Rx badge */}
            {product.requiresPrescription && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Prescription Required</span> &mdash; Upload at checkout
                </p>
              </div>
            )}

            {/* NAFDAC number */}
            {product.nafdacNumber && (
              <p className="text-xs text-gray-400 mb-4">
                NAFDAC Reg. No: <span className="font-mono">{product.nafdacNumber}</span>
              </p>
            )}

            {/* Add to Cart section */}
            <div className="mb-6">
              <AddToCart
                productId={product.id}
                productName={product.nameGeneric}
                nameBrand={product.nameBrand}
                price={product.price}
                stockQty={product.stockQty}
                requiresPrescription={product.requiresPrescription}
                slug={product.slug}
              />
            </div>

            {/* Speak to Pharmacist */}
            <a
              href={`https://wa.me/234XXXXXXXXXX?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border-2 border-mint-500 text-mint-600 hover:bg-mint-50 font-semibold py-3 px-6 rounded-lg text-sm transition-colors"
            >
              <MessageCircle size={18} />
              Speak to a Pharmacist
            </a>
          </div>
        </div>

        {/* ===== Tabs Section ===== */}
        <div className="mt-12 border-t border-gray-100 pt-8">
          <ProductTabs tabs={tabs} />
        </div>

        {/* ===== Medical Disclaimer ===== */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4 text-xs text-gray-500 leading-relaxed">
          <p>
            <strong>Medical Disclaimer:</strong> Product information provided on this page is for
            informational purposes only and is not a substitute for professional medical advice,
            diagnosis, or treatment. Always seek the advice of a qualified healthcare professional
            before starting any medication. Seb &amp; Bayor Pharmaceutical Ltd does not recommend
            self-medication.
          </p>
        </div>

        {/* ===== Related Products ===== */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/shop/product/${rp.slug}`}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 text-xs">Image</span>
                  </div>
                  <div className="p-3 md:p-4">
                    {rp.requiresPrescription && (
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-red-100 text-red-700 px-2 py-0.5 rounded mb-2">
                        Rx Required
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-mint-600 transition-colors line-clamp-2">
                      {rp.nameGeneric}
                    </h3>
                    {rp.nameBrand && (
                      <p className="text-xs text-gray-400 mt-0.5">{rp.nameBrand}</p>
                    )}
                    <p className="text-base font-bold text-gray-900 mt-2">
                      {`₦${rp.price.toLocaleString()}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
