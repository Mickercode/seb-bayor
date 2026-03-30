// ============================================
// API Client — handles all fetch calls + auth
// ============================================

const API = {
  async request(url, options = {}) {
    const config = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      credentials: 'same-origin',
      ...options,
    };
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  },

  get(url) { return this.request(url); },
  post(url, body) { return this.request(url, { method: 'POST', body }); },
  put(url, body) { return this.request(url, { method: 'PUT', body }); },
  patch(url, body) { return this.request(url, { method: 'PATCH', body }); },
  del(url) { return this.request(url, { method: 'DELETE' }); },

  // Auth
  async login(email, password) { return this.post('/api/auth/login', { email, password }); },
  async register(data) { return this.post('/api/auth/register', data); },
  async logout() { return this.post('/api/auth/logout'); },
  async me() { return this.get('/api/auth/me'); },
  async forgotPassword(email) { return this.post('/api/auth/forgot-password', { email }); },
  async resetPassword(token, password) { return this.post('/api/auth/reset-password', { token, password }); },

  // Admin auth
  async adminLogin(email, password) { return this.post('/api/admin/login', { email, password }); },
  async adminLogout() { return this.post('/api/admin/logout'); },

  // Products
  async getProducts(params = '') { return this.get(`/api/products${params ? '?' + params : ''}`); },
  async getProduct(slug) { return this.get(`/api/products/${slug}`); },
  async getCategories() { return this.get('/api/categories'); },

  // Cart
  async getCart() { return this.get('/api/cart'); },
  async syncCart(items) { return this.put('/api/cart', { items }); },
  async clearCart() { return this.del('/api/cart'); },

  // Orders
  async createOrder(data) { return this.post('/api/orders', data); },
  async getOrders() { return this.get('/api/orders'); },

  // Addresses
  async getAddresses() { return this.get('/api/addresses'); },
  async createAddress(data) { return this.post('/api/addresses', data); },
  async updateAddress(id, data) { return this.put(`/api/addresses/${id}`, data); },
  async deleteAddress(id) { return this.del(`/api/addresses/${id}`); },

  // Admin
  async adminGetOrders(status) { return this.get(`/api/admin/orders${status ? '?status=' + status : ''}`); },
  async adminGetOrder(id) { return this.get(`/api/admin/orders/${id}`); },
  async adminUpdateOrder(id, data) { return this.patch(`/api/admin/orders/${id}`, data); },
  async adminGetProducts() { return this.get('/api/admin/products'); },
  async adminUpdateProduct(id, data) { return this.patch(`/api/admin/products/${id}`, data); },
  async adminGetCustomers() { return this.get('/api/admin/customers'); },
  async adminGetPrescriptions() { return this.get('/api/admin/prescriptions'); },
  async adminUpdatePrescription(id, data) { return this.patch(`/api/admin/prescriptions/${id}`, data); },
  async adminGetCategories() { return this.get('/api/admin/categories'); },
};

window.API = API;
