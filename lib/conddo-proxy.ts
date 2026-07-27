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

export { CONDDO_API, TENANT_SLUG };
