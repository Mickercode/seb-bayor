// ============================================
// Shared Components — Nav, Footer
// ============================================

const Components = {
  corporateNav(activePath = '') {
    const link = (href, label) => `<a href="${href}" class="block px-3 py-2 rounded-md transition-colors ${activePath === href ? 'text-teal-700 font-semibold' : 'text-gray-600 hover:text-teal-700 hover:bg-gray-50'}">${label}</a>`;
    const mobileLink = (href, label) => `<a href="${href}" class="flex items-center px-4 py-3 rounded-lg transition-colors ${activePath === href ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}">${label}</a>`;

    return `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="container-max px-4 md:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a href="/" class="flex items-center shrink-0 -my-6">
            <img src="/seb-bayor-logo.png" alt="Seb & Bayor" class="h-32 md:h-36 w-auto" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <span class="text-xl font-bold text-teal-700 hidden">Seb & Bayor</span>
          </a>

          <!-- Desktop nav links (centered) -->
          <nav class="hidden lg:flex items-center gap-1 text-sm">
            ${link('/', 'Home')}
            ${link('/about', 'About')}
            ${link('/services', 'Services')}
            ${link('/shop', 'Shop')}
            ${link('/contact', 'Contact')}
            ${link('/faqs', 'FAQs')}
          </nav>

          <!-- Desktop right side: cart + auth -->
          <div class="hidden lg:flex items-center gap-3">
            <a href="/cart" class="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" id="nav-cart">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
              <span id="cart-count" class="hidden absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-mint-500 text-white text-xs font-bold"></span>
            </a>
            <div class="w-px h-6 bg-gray-200"></div>
            <div id="nav-auth" class="flex items-center gap-2">
              <a href="/auth/login" class="text-sm font-medium text-gray-600 hover:text-teal-700 px-3 py-2 rounded-md transition-colors">Log in</a>
              <a href="/auth/register" class="text-sm font-semibold bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition-colors">Sign up</a>
            </div>
            <div id="nav-user" class="hidden items-center gap-2">
              <a href="/dashboard/orders" class="text-sm font-medium text-gray-600 hover:text-teal-700 px-3 py-2 rounded-md transition-colors flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Account
              </a>
              <button onclick="Auth.logout()" class="text-sm text-gray-400 hover:text-red-500 px-2 py-2 transition-colors">Log out</button>
            </div>
          </div>

          <!-- Mobile: hamburger only -->
          <button class="lg:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile drawer -->
      <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-gray-100">
        <div class="container-max px-4 py-4 space-y-1">
          ${mobileLink('/', 'Home')}
          ${mobileLink('/about', 'About')}
          ${mobileLink('/services', 'Services')}
          ${mobileLink('/shop', 'Shop')}
          ${mobileLink('/contact', 'Contact')}
          ${mobileLink('/faqs', 'FAQs')}

          <div class="border-t border-gray-100 my-2"></div>

          <a href="/cart" class="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
              Cart
            </span>
            <span id="mobile-cart-count" class="hidden w-5 h-5 flex items-center justify-center rounded-full bg-mint-500 text-white text-xs font-bold"></span>
          </a>

          <div class="border-t border-gray-100 my-2"></div>

          <div id="mobile-auth" class="space-y-2 px-4 pt-2 pb-1">
            <a href="/auth/login" class="block w-full text-center py-2.5 text-sm font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors">Log in</a>
            <a href="/auth/register" class="block w-full text-center py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">Sign up</a>
          </div>
          <div id="mobile-user" class="hidden space-y-1">
            <a href="/dashboard/orders" class="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              My Account
            </a>
            <button onclick="Auth.logout()" class="flex items-center gap-2 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 w-full text-left">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>`;
  },

  shopNav() {
    return `
    <header data-zone="shop" class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="container-max px-4 md:px-8">
        <div class="flex items-center justify-between h-16 gap-4">
          <!-- Logo -->
          <a href="/shop" class="flex items-center shrink-0 -my-6">
            <img src="/anythingdrugs-logo.png" alt="AnythingDrugs" class="h-32 md:h-36 w-auto" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'">
            <span class="text-xl font-bold hidden" style="color: var(--color-primary)">AnythingDrugs</span>
          </a>

          <!-- Desktop search (centered, flexible) -->
          <form action="/shop/search" class="hidden md:flex flex-1 max-w-lg">
            <div class="flex w-full border border-gray-200 rounded-full overflow-hidden bg-gray-50 focus-within:border-mint-400 focus-within:bg-white transition-colors">
              <input type="text" name="q" placeholder="Search medications, vitamins, health products..." class="flex-1 px-4 py-2 text-sm outline-none bg-transparent">
              <button type="submit" class="px-4 text-gray-400 hover:text-mint-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></button>
            </div>
          </form>

          <!-- Desktop right actions -->
          <div class="hidden md:flex items-center gap-2 shrink-0">
            <a href="/cart" class="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" id="shop-nav-cart">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
              <span id="shop-cart-count" class="hidden absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-mint-500 text-white text-xs font-bold"></span>
            </a>
            <div class="w-px h-5 bg-gray-200"></div>
            <div id="shop-nav-auth" class="flex items-center gap-2">
              <a href="/auth/login" class="text-sm font-medium text-gray-600 hover:text-mint-600 px-3 py-1.5 rounded-md transition-colors">Log in</a>
              <a href="/auth/register" class="text-sm font-semibold bg-mint-500 text-white px-4 py-1.5 rounded-lg hover:bg-mint-600 transition-colors">Sign up</a>
            </div>
            <div id="shop-nav-user" class="hidden items-center gap-2">
              <a href="/dashboard/orders" class="text-sm font-medium text-gray-600 hover:text-mint-600 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Account
              </a>
            </div>
          </div>

          <!-- Mobile: hamburger only -->
          <button class="md:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg" onclick="document.getElementById('shop-mobile-menu').classList.toggle('hidden')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile drawer -->
      <div id="shop-mobile-menu" class="hidden md:hidden bg-white border-t border-gray-100">
        <div class="container-max px-4 py-4 space-y-3">
          <!-- Mobile search -->
          <form action="/shop/search">
            <div class="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-mint-400">
              <input type="text" name="q" placeholder="Search medications..." class="flex-1 px-4 py-2.5 text-sm outline-none">
              <button type="submit" class="px-4 text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></button>
            </div>
          </form>

          <a href="/shop" class="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Browse All
          </a>

          <a href="/cart" class="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
              Cart
            </span>
            <span id="shop-mobile-cart-count" class="hidden w-5 h-5 flex items-center justify-center rounded-full bg-mint-500 text-white text-xs font-bold"></span>
          </a>

          <div class="border-t border-gray-100"></div>

          <div id="shop-mobile-auth" class="space-y-2 px-4">
            <a href="/auth/login" class="block w-full text-center py-2.5 text-sm font-medium text-mint-700 border border-mint-200 rounded-lg hover:bg-mint-50">Log in</a>
            <a href="/auth/register" class="block w-full text-center py-2.5 text-sm font-semibold text-white bg-mint-500 rounded-lg hover:bg-mint-600">Sign up</a>
          </div>
          <div id="shop-mobile-user" class="hidden space-y-1">
            <a href="/dashboard/orders" class="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              My Account
            </a>
          </div>
        </div>
      </div>
    </header>`;
  },

  footer() {
    return `
    <footer class="bg-gray-900 text-gray-400 section-padding" data-zone="corporate">
      <div class="container-max">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Seb & Bayor</h3>
            <p class="text-sm leading-relaxed">Patient-centered pharmacy and digital health solutions in Nigeria.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Services</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="/services/retail-pharmacy" class="hover:text-white transition-colors">Retail Pharmacy</a></li>
              <li><a href="/shop" class="hover:text-white transition-colors">E-Pharmacy</a></li>
              <li><a href="/services/consultations" class="hover:text-white transition-colors">Consultations</a></li>
              <li><a href="/services/drug-information" class="hover:text-white transition-colors">Drug Information</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Company</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="/about" class="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" class="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/faqs" class="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="/digital-health" class="hover:text-white transition-colors">Digital Health</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="/legal/terms" class="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/legal/privacy" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/legal/disclaimer" class="hover:text-white transition-colors">Medical Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 text-center text-xs">
          <p>&copy; ${new Date().getFullYear()} Seb & Bayor Pharmaceutical Ltd. All rights reserved.</p>
          <p class="mt-2">This platform does not replace professional medical diagnosis or treatment.</p>
        </div>
      </div>
    </footer>`;
  },

  dashboardShell(activePath, contentHtml) {
    const navItems = [
      { href: '/dashboard/orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
      { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { href: '/dashboard/addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
      { href: '/dashboard/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];
    const nav = navItems.map(i => `
      <a href="${i.href}" class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activePath === i.href ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="${i.icon}"/></svg>
        ${i.label}
      </a>
    `).join('');

    return `
    <div class="min-h-screen bg-gray-50">
      ${Components.corporateNav('/dashboard')}
      <div class="container-max px-4 md:px-8 py-8">
        <div class="flex flex-col md:flex-row gap-8">
          <aside class="md:w-56 shrink-0">
            <nav class="flex md:flex-col gap-1 overflow-x-auto hide-scrollbar">${nav}</nav>
          </aside>
          <main class="flex-1 min-w-0">${contentHtml}</main>
        </div>
      </div>
      ${Components.footer()}
    </div>`;
  },
};

// Auth state — check on page load
const Auth = {
  user: null,
  async init() {
    try {
      const data = await API.me();
      this.user = data.user;
      this._updateNav(true);
    } catch {
      this._updateNav(false);
    }
    Cart.init();
  },

  async logout() {
    await API.logout().catch(() => {});
    window.location.href = '/';
  },

  _updateNav(loggedIn) {
    // Toggle auth/user visibility for all nav variants
    const togglePairs = [
      ['nav-auth', 'nav-user'],           // corporate desktop
      ['mobile-auth', 'mobile-user'],     // corporate mobile
      ['shop-nav-auth', 'shop-nav-user'], // shop desktop
      ['shop-mobile-auth', 'shop-mobile-user'], // shop mobile
    ];
    togglePairs.forEach(([authId, userId]) => {
      const authEl = document.getElementById(authId);
      const userEl = document.getElementById(userId);
      if (authEl) { authEl.classList.toggle('hidden', loggedIn); }
      if (userEl) {
        userEl.classList.toggle('hidden', !loggedIn);
        if (loggedIn) userEl.classList.add('flex');
      }
    });
    // Cart badges
    this._updateCartBadge();
  },

  _updateCartBadge() {
    Cart.onChange((items) => {
      const count = items.reduce((s, i) => s + i.quantity, 0);
      ['cart-count', 'shop-cart-count', 'mobile-cart-count', 'shop-mobile-cart-count'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = count > 99 ? '99+' : count;
          el.classList.toggle('hidden', count === 0);
        }
      });
    });
  },
};

window.Components = Components;
window.Auth = Auth;

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => Auth.init());
