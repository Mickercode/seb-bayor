import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      data-zone="corporate"
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Image
              src="/seb-bayor-logo.png"
              alt="Seb & Bayor Pharmaceuticals"
              width={130}
              height={46}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        {children}
      </div>
    </div>
  )
}
