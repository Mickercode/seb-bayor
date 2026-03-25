import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, FileText, Package } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !['PHARMACIST', 'ADMIN'].includes(session.role)) {
    redirect('/auth/login');
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/prescriptions', label: 'Prescriptions', icon: FileText },
    { href: '/admin/products', label: 'Products (Phase 2)', icon: Package },
  ];

  return (
    <div data-zone="corporate" className="min-h-screen bg-gray-50">
      {/* Mobile top nav */}
      <nav className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container-max section-padding">
          <p className="text-sm font-bold text-teal-800 mb-2">Seb &amp; Bayor Admin</p>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg whitespace-nowrap transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-teal-900 text-white">
          <div className="p-6 border-b border-teal-800">
            <Link href="/admin" className="text-xl font-bold text-white">
              Seb &amp; Bayor Admin
            </Link>
            <p className="text-sm text-teal-300 mt-1">
              {session.role === 'PHARMACIST' ? 'Pharmacist' : 'Administrator'}
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-800 rounded-lg transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-teal-800">
            <p className="text-sm text-teal-300">{session.email}</p>
            <p className="text-xs text-teal-400">{session.role}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 section-padding">
          <div className="container-max">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
