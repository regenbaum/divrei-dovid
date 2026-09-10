'use client'

import { upload } from '@vercel/blob/client'

// Uploads a file directly from the browser to Blob storage (bypassing our
// server function's size limit). The actual type/size restrictions are
// enforced server-side in /api/tributes/upload — this is just the client
// call, not a security boundary itself.
export async function uploadImageToBlob(file) {
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/tributes/upload',
  })
  return blob.url
}
