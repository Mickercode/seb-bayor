import { ShopNav } from '@/components/shop/shop-nav'
import { ShopFooter } from '@/components/shop/shop-footer'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-zone="shop" className="min-h-screen flex flex-col">
      <ShopNav />
      <main className="flex-1">{children}</main>
      <ShopFooter />
      <WhatsAppButton message="Hello, I need help with my AnythingDrugs order." />
    </div>
  )
}
