// ---------------------------------------------------------------------------
// This file is the ONLY place in the whole site that knows where shiur data
// actually lives. Right now that's a public Google Drive folder. When this
// project outgrows Drive (real search, transcripts, tagging by topic, etc.),
// replace the *inside* of getAllShiurim() to read from Supabase/Airtable/a
// real database instead — every page calls getAllShiurim() or
// getFeaturedShiurim(), never Drive directly, so nothing else has to change.
// ---------------------------------------------------------------------------

const FOLDER_ID =
  process.env.GOOGLE_DRIVE_FOLDER_ID || '1zIhSM2q9Kt-xAIa3muG7lZhbKBm70Q3s'
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY

export async function getAllShiurim() {
  if (!API_KEY) {
    // No key configured yet — fail quietly so the site still builds and
    // renders; pages show an empty state instead of crashing.
    return []
  }

  const params = new URLSearchParams({
    q: `'${FOLDER_ID}' in parents and trashed = false`,
    fields: 'files(id,name,mimeType,size,createdTime,webViewLink)',
    pageSize: '1000',
    key: API_KEY,
  })

  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      { cache: 'no-store' }
    )
    if (!res.ok) {
      console.error('Google Drive API error:', res.status, await res.text())
      return []
    }
    const data = await res.json()
    return (data.files || [])
      .filter((f) => !f.mimeType?.includes('folder'))
      .map(toShiur)
      .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
  } catch (err) {
    console.error('Failed to fetch shiurim from Google Drive:', err)
    return []
  }
}

export async function getFeaturedShiurim() {
  const { FEATURED } = await import('./featured')
  const all = await getAllShiurim()
  const byId = new Map(all.map((s) => [s.id, s]))

  return FEATURED.map((f) => {
    const match = byId.get(f.driveFileId)
    return {
      ...f,
      ...(match || {}),
      title: f.title || match?.title,
      description: f.description,
    }
  })
}

function toShiur(file) {
  return {
    id: file.id,
    title: cleanTitle(file.name),
    rawName: file.name,
    mimeType: file.mimeType,
    createdTime: file.createdTime,
    viewUrl: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
  }
}

function cleanTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
}
