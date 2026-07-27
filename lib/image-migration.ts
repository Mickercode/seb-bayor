/**
 * Image Migration Utility
 *
 * Migrates product images from Conddo Cloudinary to SebBayor Cloudinary
 * so product images are fully owned by SebBayor.
 *
 * Uses in-memory cache + JSON file persistence to avoid re-uploading
 * the same images on every request.
 */

// We only import v2 type and configure lazily to avoid build-time failures
// when env vars aren't set yet.
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

const SEB_BAYOR_FOLDER = 'seb-bayor/products'
const CACHE_FILE = path.join(process.cwd(), 'data', 'image-cache.json')

const CONDDO_CLOUDINARY_DOMAINS = [
  'res.cloudinary.com/conddo',
  'res.cloudinary.com/dzultlu5f',
]

// ── Lazy cloudinary config ─────────────────────────────────────
let configured = false

function ensureConfigured(): void {
  if (configured) return
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  configured = true
}

// ── In-memory cache ────────────────────────────────────────────
let cache: Record<string, string> | null = null

function loadCache(): Record<string, string> {
  if (cache) return cache
  try {
    if (fs.existsSync(CACHE_FILE)) {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
    } else {
      cache = {}
    }
  } catch {
    cache = {}
  }
  return cache as Record<string, string>
}

function saveCache(): void {
  try {
    const dir = path.dirname(CACHE_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8')
  } catch {
    // Non-critical - cache will rebuild
  }
}

// ── Helpers ────────────────────────────────────────────────────
function isConddoCloudinaryUrl(url: string): boolean {
  return CONDDO_CLOUDINARY_DOMAINS.some((d) => url.includes(d))
}

function getFirstImageUrl(images: unknown): string | null {
  if (!Array.isArray(images) || images.length === 0) return null
  const first = images[0]
  if (typeof first === 'string') return first
  if (first && typeof first === 'object') {
    const e = first as Record<string, unknown>
    return typeof e.url === 'string' ? e.url : null
  }
  return null
}

// ── Core migration logic ───────────────────────────────────────

/**
 * Migrate a single image from Conddo Cloudinary to SebBayor Cloudinary.
 * Returns the SebBayor URL (or original URL on failure).
 */
export async function migrateImage(conddoUrl: string): Promise<string> {
  if (!isConddoCloudinaryUrl(conddoUrl)) return conddoUrl

  const map = loadCache()
  if (map[conddoUrl]) return map[conddoUrl]

  try {
    ensureConfigured()

    const response = await fetch(conddoUrl)
    if (!response.ok) {
      console.warn('Failed to fetch:', conddoUrl, response.status)
      return conddoUrl
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const suffix = Date.now().toString(36)

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: SEB_BAYOR_FOLDER,
            public_id: 'product-' + suffix,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result as { secure_url: string })
          },
        )
        .end(buffer)
    })

    map[conddoUrl] = result.secure_url
    saveCache()
    return result.secure_url
  } catch (err) {
    console.error('Failed to migrate image:', conddoUrl, err)
    return conddoUrl
  }
}

/**
 * Get the best image URL for a product's images array.
 * Migrates from Conddo Cloudinary on first access.
 */
export async function getBestProductImage(images: unknown): Promise<string | null> {
  const url = getFirstImageUrl(images)
  if (!url) return null
  return migrateImage(url)
}

/**
 * Trigger full migration of ALL existing product images.
 */
export async function migrateAllProductImages(adminToken: string) {
  const { proxy, toSebProductList } = await import('./conddo-proxy')

  const result = await proxy(
    'GET',
    '/inventory/products?size=500',
    undefined,
    adminToken,
  )
  if (result.status >= 400) throw new Error('Failed to fetch products: ' + result.status)

  const productList = toSebProductList(result.body)
  const products = productList.products as Record<string, unknown>[]
  let totalImages = 0
  let migrated = 0
  let failed = 0

  for (const product of products) {
    const images = product.images as unknown[]
    if (!Array.isArray(images) || images.length === 0) continue

    for (const img of images) {
      totalImages++
      const url = typeof img === 'string' ? img : (img as Record<string, unknown>).url as string
      if (!url) continue
      const sebUrl = await migrateImage(url)
      if (sebUrl !== url) migrated++
      else failed++
    }
  }

  return { totalProducts: products.length, totalImages, migrated, failed }
}

export function getImageCacheStats(): { size: number } {
  return { size: Object.keys(loadCache()).length }
}

export { CONDDO_CLOUDINARY_DOMAINS }
