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

  try {
    const files = []
    // Each queue entry carries a "category" — the name of the top-level
    // subfolder it descends from (Chanukah, Hasidut, Maharal, etc.), so
    // every file inherits its topic from wherever it lives in the Drive
    // folder structure, without any manual tagging.
    const folderQueue = [{ id: FOLDER_ID, category: null }]
    const visited = new Set()
    let safetyCounter = 0

    while (folderQueue.length > 0 && safetyCounter < 500) {
      const { id: currentFolder, category } = folderQueue.shift()
      if (visited.has(currentFolder)) continue
      visited.add(currentFolder)
      safetyCounter += 1

      const params = new URLSearchParams({
        q: `'${currentFolder}' in parents and trashed = false`,
        fields: 'files(id,name,mimeType,size,createdTime,webViewLink)',
        pageSize: '1000',
        key: API_KEY,
      })

      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
        { next: { revalidate: 3600 } } // re-crawl at most once an hour
      )
      if (!res.ok) {
        console.error('Google Drive API error for folder', currentFolder, res.status, await res.text())
        continue
      }
      const data = await res.json()
      for (const item of data.files || []) {
        if (item.mimeType?.includes('folder')) {
          // Still at the root: this folder's own name becomes the
          // category for everything inside it. Already inside a
          // category: keep passing the same one down.
          folderQueue.push({ id: item.id, category: category || item.name })
        } else {
          files.push({ ...item, category: category || 'General' })
        }
      }
    }

    return files
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
    category: file.category || 'General',
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
