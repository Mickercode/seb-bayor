import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, FileText, MapPin, User, MessageCircle } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const navItems = [
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: FileText },
    { href: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  return (
    <div data-zone="shop" className="min-h-screen bg-gray-50">
      {/* Mobile top nav */}
      <nav className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container-max section-padding">
          <p className="text-sm text-gray-500 mb-2">
            Welcome, <span className="font-medium text-gray-900">{session.email}</span>
          </p>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg whitespace-nowrap transition-colors"
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
        <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-white border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-teal-700">
              Seb &amp; Bayor
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Welcome, <span className="font-medium text-gray-900">{session.email}</span>
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 section-padding">
          <div className="container-max">
            {children}
          </div>
        </main>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/2348000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
