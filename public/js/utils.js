// ============================================
// Utility functions
// ============================================

const Utils = {
  formatPrice(amount) {
    return '₦' + Number(amount).toLocaleString('en-NG');
  },

  formatDate(dateStr) {
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric', month: 'short', year: 'numeric',
    }).format(new Date(dateStr));
  },

  formatDateTime(dateStr) {
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));
  },

  shortId(id) {
    return '#' + (id || '').slice(0, 8).toUpperCase();
  },

  getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  getPathSegment(index) {
    return window.location.pathname.split('/').filter(Boolean)[index] || '';
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  },

  statusBadge(status) {
    const map = {
      PENDING: 'badge-gray', RX_REVIEW: 'badge-amber',
      CONFIRMED: 'badge-teal', DISPATCHED: 'badge-blue',
      DELIVERED: 'badge-green', CANCELLED: 'badge-red',
      APPROVED: 'badge-green', QUERIED: 'badge-amber',
      REJECTED: 'badge-red', PAID: 'badge-green', FAILED: 'badge-red',
    };
    const cls = map[status] || 'badge-gray';
    return `<span class="badge ${cls}">${Utils.escapeHtml((status || '').replace('_', ' '))}</span>`;
  },

  $(sel, parent) { return (parent || document).querySelector(sel); },
  $$(sel, parent) { return Array.from((parent || document).querySelectorAll(sel)); },
};

window.Utils = Utils;
window.$ = Utils.$;
window.$$ = Utils.$$;
