/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
  },
  // Serve static HTML pages from /public with clean URLs
  async rewrites() {
    return {
      beforeFiles: [
        // Homepage
        { source: '/', destination: '/pages/index.html' },
        // Corporate
        { source: '/about', destination: '/pages/about.html' },
        { source: '/contact', destination: '/pages/contact.html' },
        { source: '/faqs', destination: '/pages/faqs.html' },
        { source: '/digital-health', destination: '/pages/digital-health.html' },
        { source: '/services', destination: '/pages/services.html' },
        { source: '/services/:slug', destination: '/pages/services/:slug.html' },
        { source: '/legal/:slug', destination: '/pages/legal/:slug.html' },
        // Auth
        { source: '/auth/login', destination: '/pages/auth/login.html' },
        { source: '/auth/register', destination: '/pages/auth/register.html' },
        { source: '/auth/forgot-password', destination: '/pages/auth/forgot-password.html' },
        { source: '/auth/reset-password', destination: '/pages/auth/reset-password.html' },
        // Shop
        { source: '/shop', destination: '/pages/shop/index.html' },
        { source: '/shop/search', destination: '/pages/shop/search.html' },
        { source: '/shop/product/:slug', destination: '/pages/shop/product.html' },
        { source: '/shop/:category', destination: '/pages/shop/category.html' },
        // Cart & Checkout
        { source: '/cart', destination: '/pages/cart.html' },
        { source: '/checkout', destination: '/pages/checkout.html' },
        { source: '/prescription/upload', destination: '/pages/prescription-upload.html' },
        { source: '/consult', destination: '/pages/consult.html' },
        // Customer Dashboard
        { source: '/dashboard', destination: '/pages/dashboard/orders.html' },
        { source: '/dashboard/orders', destination: '/pages/dashboard/orders.html' },
        { source: '/dashboard/prescriptions', destination: '/pages/dashboard/prescriptions.html' },
        { source: '/dashboard/addresses', destination: '/pages/dashboard/addresses.html' },
        { source: '/dashboard/profile', destination: '/pages/dashboard/profile.html' },
        // Blog
        { source: '/blog', destination: '/pages/blog/index.html' },
        { source: '/blog/:slug', destination: '/pages/blog/article.html' },
        // Admin
        { source: '/admin', destination: '/pages/admin/index.html' },
        { source: '/admin/login', destination: '/pages/admin/login.html' },
        { source: '/admin/orders', destination: '/pages/admin/orders.html' },
        { source: '/admin/orders/:id', destination: '/pages/admin/order-detail.html' },
        { source: '/admin/prescriptions', destination: '/pages/admin/prescriptions.html' },
        { source: '/admin/products', destination: '/pages/admin/products.html' },
        { source: '/admin/customers', destination: '/pages/admin/customers.html' },
        { source: '/admin/products/new', destination: '/pages/admin/product-form.html' },
        { source: '/admin/users', destination: '/pages/admin/users.html' },
        { source: '/admin/articles', destination: '/pages/admin/articles.html' },
        { source: '/admin/articles/new', destination: '/pages/admin/article-form.html' },
      ],
    }
  },
}

module.exports = nextConfig
