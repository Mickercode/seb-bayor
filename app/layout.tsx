import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/shared/providers'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Seb & Bayor Pharmaceutical Ltd | Trusted Pharmacy & Digital Health Solutions',
    template: '%s | Seb & Bayor Pharmaceutical Ltd',
  },
  description:
    'Patient-centered care through retail, digital, and professional pharmacy services in Nigeria.',
  keywords: [
    'pharmacy Nigeria',
    'online pharmacy Lagos',
    'e-pharmacy Nigeria',
    'buy medications online Nigeria',
    'Seb and Bayor',
    'AnythingDrugs',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
