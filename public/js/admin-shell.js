// Admin layout shell — shared across admin pages
function adminShell(activePath, contentHtml) {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { href: '/admin/orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { href: '/admin/prescriptions', label: 'Prescriptions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { href: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { href: '/admin/customers', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { href: '/admin/articles', label: 'Articles', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { href: '/admin/users', label: 'Staff', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const sideNav = navItems.map(i => `
    <a href="${i.href}" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activePath === i.href ? 'text-white bg-teal-800' : 'text-teal-100 hover:text-white hover:bg-teal-800'}">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="${i.icon}"/></svg>
      ${i.label}
    </a>`).join('');

  const mobileNav = navItems.map(i => `
    <a href="${i.href}" class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors ${activePath === i.href ? 'text-teal-800 bg-teal-50' : 'text-gray-600 hover:text-teal-800 hover:bg-teal-50'}">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="${i.icon}"/></svg>
      ${i.label}
    </a>`).join('');

  return `
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile nav -->
    <nav class="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-bold text-teal-800">Seb & Bayor Admin</p>
          <button onclick="API.adminLogout().then(()=>location.href='/admin/login')" class="text-xs text-gray-400 hover:text-red-500">Sign Out</button>
        </div>
        <div class="flex gap-1 overflow-x-auto hide-scrollbar pb-1">${mobileNav}</div>
      </div>
    </nav>
    <div class="flex">
      <!-- Sidebar -->
      <aside class="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-teal-900 text-white">
        <div class="p-6 border-b border-teal-800">
          <a href="/admin" class="text-xl font-bold text-white">Seb & Bayor Admin</a>
          <p class="text-sm text-teal-300 mt-1">Administrator</p>
        </div>
        <nav class="flex-1 p-4 space-y-1">${sideNav}</nav>
        <div class="p-4 border-t border-teal-800">
          <button onclick="API.adminLogout().then(()=>location.href='/admin/login')" class="flex items-center gap-2 text-sm text-teal-300 hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Sign Out
          </button>
        </div>
      </aside>
      <main class="flex-1 p-4 md:p-8"><div class="max-w-7xl mx-auto">${contentHtml}</div></main>
    </div>
  </div>`;
}
window.adminShell = adminShell;
