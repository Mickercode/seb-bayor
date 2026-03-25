import { CorporateNav } from '@/components/shared/corporate-nav'
import { Footer } from '@/components/shared/footer'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'

export default function CorporateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-zone="corporate">
      <CorporateNav />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
