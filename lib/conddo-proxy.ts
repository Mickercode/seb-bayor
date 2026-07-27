/**
 * Conddo API proxy utility.
 *
 * Each SebBayor API route becomes a thin wrapper that calls this module:
 * it forwards the request to Conddo's backend, transforms the response
 * shape to match what SebBayor's static HTML + client JS expect, and
 * handles auth cookie forwarding.
 *
 * Environment variables:
 *   CONDDO_API_URL     — base URL, e.g. "https://api.getconddo.com"
 *   CONDDO_TENANT_SLUG — the tenant's slug, e.g. "seb-bayor"
 */

const CONDDO_API = process.env.CONDDO_API_URL || "https://api.getconddo.com";
const TENANT_SLUG = process.env.CONDDO_TENANT_SLUG || "";
const CONDDO_SITE_KEY = process.env.CONDDO_SITE_KEY || "";

// Whether the site key is configured — determines if customer auth proxies
// go through Conddo's public API or fall back to local SQLite.
export const hasSiteKey = CONDDO_SITE_KEY.length > 0;

export interface ProxyResult {
  status: number;
  body: unknown;
}

export async function proxy(
  method: string,
  path: string,
  body?: unknown,
  bearer?: string | null,
): Promise<ProxyResult> {
  const url = `${CONDDO_API}/api/v1${path}`;
  const headers: Record<string, string> = { accept: "application/json" };
  if (body !== undefined) {
    headers["content-type"] = "application/json";
  }
  if (bearer) {
    headers["authorization"] = `Bearer ${bearer}`;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let responseBody: unknown;
  const text = await res.text();
  try {
    responseBody = text ? JSON.parse(text) : {};
  } catch {
    responseBody = { raw: text };
  }
  return { status: res.status, body: responseBody };
}

/**
 * Proxies a request to Conddo's public API (requires X-Conddo-Site-Key header).
 * Used for customer auth — register, login, me, etc.
 */
export async function publicProxy(
  method: string,
  path: string,
  body?: unknown,
  customerBearer?: string | null,
): Promise<ProxyResult> {
  const slug = TENANT_SLUG;
  const url = `${CONDDO_API}/api/v1/public/${slug}${path}`;
  const headers: Record<string, string> = {
    accept: "application/json",
    "X-Conddo-Site-Key": CONDDO_SITE_KEY,
  };
  if (body !== undefined) {
    headers["content-type"] = "application/json";
  }
  if (customerBearer) {
    headers["authorization"] = `Bearer ${customerBearer}`;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let responseBody: unknown;
  const text = await res.text();
  try {
    responseBody = text ? JSON.parse(text) : {};
  } catch {
    responseBody = { raw: text };
  }
  return { status: res.status, body: responseBody };
}

export function toSebProductList(conddoData: unknown): { products: unknown[] } {
  const items = unwrapDataArray(conddoData);
  return { products: items.map((i) => toSebProduct(i as Record<string, unknown>)) };
}

export function toSebProductDetail(conddoData: unknown): { product: unknown } {
  const item = unwrapDataObject(conddoData);
  return { product: toSebProduct(item) };
}

function toSebProduct(p: Record<string, unknown>): Record<string, unknown> {
  return {
    id: p.id,
    nameGeneric: p.name ?? p.nameGeneric ?? "",
    nameBrand: p.nameBrand ?? null,
    slug: p.slug ?? p.id,
    description: p.description ?? "",
    price: typeof p.price === "number" ? p.price : Number(p.price ?? 0),
    stockQty: typeof p.stock === "number" ? p.stock : 0,
    categoryId: p.categoryId,
    category: p.category ?? null,
    requiresPrescription: p.requiresPrescription ?? false,
    images: p.images ?? [],
    isActive: p.active ?? true,
    nafdacNumber: p.nafdacNumber ?? null,
    brand: p.brand ?? null,
    indications: p.indications ?? null,
    dosageGuidance: p.dosageGuidance ?? null,
    warnings: p.warnings ?? null,
    storage: p.storage ?? null,
    createdAt: p.createdAt ?? null,
  };
}

export function toSebCategoryList(conddoData: unknown): { categories: unknown[] } {
  const items = unwrapDataArray(conddoData);
  return {
    categories: items.map((i) => {
      const c = i as Record<string, unknown>;
      return {
        id: c.id,
        name: c.name,
        slug: (c.name as string)?.toLowerCase().replace(/\s+/g, "-") ?? "",
        icon: c.icon ?? null,
        productCount: c.productCount ?? 0,
      };
    }),
  };
}

export function toSebOrderCreated(conddoData: unknown): { success: boolean; order: unknown } {
  const d = unwrapDataObject(conddoData);
  const order = d.order ?? d;
  return {
    success: true,
    order: {
      id: (order as Record<string, unknown>).id,
      status: (order as Record<string, unknown>).status ?? "PENDING",
      total: (order as Record<string, unknown>).total,
      reference: (order as Record<string, unknown>).reference,
      createdAt: (order as Record<string, unknown>).createdAt,
    },
  };
}

export function toSebLoginResponse(conddoData: unknown): { success: boolean; user: unknown } {
  const d = unwrapDataObject(conddoData);
  return {
    success: true,
    user: {
      id: (d as Record<string, unknown>).userId ?? (d as Record<string, unknown>).id,
      email: (d as Record<string, unknown>).email,
      fullName: (d as Record<string, unknown>).fullName ?? "",
      role: (d as Record<string, unknown>).role ?? "PATIENT",
    },
  };
}

function unwrapDataArray(resp: unknown): unknown[] {
  if (Array.isArray(resp)) return resp;
  if (resp && typeof resp === "object") {
    const r = resp as Record<string, unknown>;
    if (Array.isArray(r.data)) return r.data;
  }
  return [];
}

function unwrapDataObject(resp: unknown): Record<string, unknown> {
  if (resp && typeof resp === "object") {
    const r = resp as Record<string, unknown>;
    if (r.data && typeof r.data === "object") return r.data as Record<string, unknown>;
    return r;
  }
  return {};
}

export function toSebCart(conddoData: unknown): { items: unknown[] } {
  const d = unwrapDataObject(conddoData);
  const cart = (d.cart ?? d) as Record<string, unknown>;
  const items = Array.isArray(cart.items) ? cart.items : [];
  return {
    items: items.map((i: unknown) => {
      const item = i as Record<string, unknown>;
      return {
        productId: item.productId ?? item.id,
        nameGeneric: item.name ?? item.nameGeneric ?? "",
        nameBrand: item.nameBrand ?? null,
        price: typeof item.price === "number" ? item.price : Number(item.price ?? 0),
        quantity: item.quantity ?? 1,
        requiresPrescription: item.requiresPrescription ?? false,
        slug: item.slug ?? item.productId,
      };
    }),
  };
}

export function toSebAddressList(conddoData: unknown): { addresses: unknown[] } {
  const d = unwrapDataObject(conddoData);
  const items = Array.isArray(d.addresses) ? d.addresses : Array.isArray(conddoData) ? conddoData : [];
  return { addresses: items };
}

export function toSebAddressCreated(conddoData: unknown): { success: boolean; address: unknown } {
  const addr = unwrapDataObject(conddoData);
  return { success: true, address: addr };
}

export function toSebPrescriptionCreated(conddoData: unknown): { success: boolean; prescription: unknown } {
  const d = unwrapDataObject(conddoData);
  if (d.prescription) {
    return { success: true, prescription: d.prescription };
  }
  return { success: true, prescription: d };
}

export function toSebPrescriptionList(conddoData: unknown): { prescriptions: unknown[] } {
  const d = unwrapDataObject(conddoData);
  const items = Array.isArray(d.prescriptions) ? d.prescriptions : [];
  return { prescriptions: items };
}

export function toSebAdminPrescriptionList(conddoData: unknown): { prescriptions: unknown[] } {
  const items = unwrapDataArray(conddoData);
  return {
    prescriptions: items.map((rx: unknown) => {
      const p = rx as Record<string, unknown>;
      return {
        id: p.id,
        patientName: p.patientName ?? "",
        fileUrl: p.fileUrl,
        status: p.status,
        submittedAt: p.submittedAt,
        reviewedAt: p.reviewedAt,
        reviewNote: p.reviewNote,
        reviewedByName: p.reviewedByName ?? null,
        user: {
          fullName: p.customerName ?? "",
          email: p.customerEmail ?? "",
          phone: p.customerPhone ?? "",
        },
      };
    }),
  };
}

export function toSebAdminCustomerList(conddoData: unknown): { customers: unknown[] } {
  const items = unwrapDataArray(conddoData);
  return {
    customers: items.map((c: unknown) => {
      const cust = c as Record<string, unknown>;
      const counts = (cust._count ?? cust.orderCounts ?? {}) as Record<string, unknown>;
      return {
        id: cust.id,
        fullName: cust.fullName ?? cust.name ?? "",
        email: cust.email ?? "",
        phone: cust.phone ?? null,
        createdAt: cust.createdAt,
        _count: {
          orders: counts.orders ?? 0,
          prescriptions: counts.prescriptions ?? 0,
        },
      };
    }),
  };
}

export function toSebAdminOrderDetail(conddoData: unknown): { order: Record<string, unknown> } {
  const d = unwrapDataObject(conddoData);
  const order = d as Record<string, unknown>;
  return {
    order: {
      id: order.id,
      status: order.stage ?? order.status ?? "PENDING",
      reference: order.reference,
      subtotal: Number(order.subtotal ?? 0),
      deliveryFee: Number(order.deliveryFee ?? 0),
      total: Number(order.amount ?? order.total ?? 0),
      notes: order.notes ?? null,
      createdAt: order.createdAt,
      paymentStatus: order.paymentStatus ?? "PENDING",
      paymentLink: order.paymentLink ?? null,
      items: Array.isArray(order.items) ? order.items.map((i: unknown) => {
        const item = i as Record<string, unknown>;
        return {
          productId: item.productId,
          product: { nameGeneric: item.description ?? item.nameGeneric ?? "", nameBrand: item.nameBrand ?? null },
          unitPrice: Number(item.unitPrice ?? 0),
          quantity: item.quantity ?? 1,
          snapshot: item.snapshot ?? JSON.stringify({ nameGeneric: item.description ?? "", price: item.unitPrice }),
        };
      }) : [],
      user: {
        fullName: order.customerName ?? "",
        email: order.customerEmail ?? "",
        phone: order.customerPhone ?? null,
      },
      address: order.addressSnapshot ? (
        typeof order.addressSnapshot === "string"
          ? JSON.parse(order.addressSnapshot)
          : order.addressSnapshot
      ) as Record<string, unknown> : null,
    },
  };
}

export { CONDDO_API, TENANT_SLUG, CONDDO_SITE_KEY };
