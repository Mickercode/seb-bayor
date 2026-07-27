import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadFile(
  fileBuffer: Buffer,
  options: {
    folder: 'prescriptions' | 'products'
    resourceType?: 'image' | 'raw' | 'auto'
  }
) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `seb-bayor/${options.folder}`,
          resource_type: options.resourceType || 'auto',
          // Keep prescriptions private, products public
          type: options.folder === 'prescriptions' ? 'private' : 'upload',
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'))
          resolve({ url: result.secure_url, publicId: result.public_id })
        }
      )
      .end(fileBuffer)
  })
}

export async function deleteFile(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}

export function getOptimizedUrl(publicId: string, options?: { width?: number; height?: number }) {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    width: options?.width,
    height: options?.height,
    crop: options?.width ? 'fill' : undefined,
  })
}

export default cloudinary
