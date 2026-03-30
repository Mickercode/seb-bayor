// ============================================
// Cart — localStorage + server sync
// ============================================

const CART_KEY = 'seb-bayor-cart';

const Cart = {
  _items: [],
  _listeners: [],
  _loggedIn: false,
  _syncTimeout: null,

  init() {
    this._items = this._load();
    this._tryServerSync();
    this._notify();
  },

  _load() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch { return []; }
  },

  _save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this._items));
    this._notify();
    this._debouncedSync();
  },

  _notify() {
    this._listeners.forEach(fn => fn(this._items));
  },

  onChange(fn) {
    this._listeners.push(fn);
    fn(this._items);
  },

  async _tryServerSync() {
    try {
      const data = await API.getCart();
      this._loggedIn = true;
      const serverItems = data.items || [];
      const localItems = this._items;
      // Merge: server + local-only items
      const merged = new Map();
      serverItems.forEach(i => merged.set(i.productId, i));
      localItems.forEach(i => {
        const existing = merged.get(i.productId);
        if (existing) {
          merged.set(i.productId, { ...existing, quantity: Math.min(Math.max(existing.quantity, i.quantity), 10) });
        } else {
          merged.set(i.productId, i);
        }
      });
      this._items = Array.from(merged.values());
      this._save();
      if (localItems.length > 0) API.syncCart(this._items).catch(() => {});
    } catch {
      // Not logged in — local only
    }
  },

  _debouncedSync() {
    if (!this._loggedIn) return;
    clearTimeout(this._syncTimeout);
    this._syncTimeout = setTimeout(() => {
      API.syncCart(this._items).catch(() => {});
    }, 500);
  },

  getItems() { return this._items; },
  getCount() { return this._items.reduce((s, i) => s + i.quantity, 0); },
  getTotal() { return this._items.reduce((s, i) => s + i.price * i.quantity, 0); },
  hasRx() { return this._items.some(i => i.requiresPrescription); },

  add(product, qty = 1) {
    const existing = this._items.find(i => i.productId === product.productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, 10);
    } else {
      this._items.push({ ...product, quantity: qty });
    }
    this._save();
  },

  remove(productId) {
    this._items = this._items.filter(i => i.productId !== productId);
    this._save();
  },

  updateQty(productId, qty) {
    if (qty <= 0) return this.remove(productId);
    const item = this._items.find(i => i.productId === productId);
    if (item) { item.quantity = Math.min(qty, 10); this._save(); }
  },

  clear() {
    this._items = [];
    this._save();
    if (this._loggedIn) API.clearCart().catch(() => {});
  },
};

window.Cart = Cart;
