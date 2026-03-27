import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import ProductForm from '@/components/admin/product-form'

export default async function NewProductPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
