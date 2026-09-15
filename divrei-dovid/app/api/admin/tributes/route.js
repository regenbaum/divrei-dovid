import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/adminAuth'
import { readJsonFile, writeJsonFile } from '@/lib/githubContent'

// Every single request here re-verifies the session server-side. The
// admin UI only ever calls this route to read or change tributes data —
// there's no other path a "backend" mistake could accidentally open,
// and nothing here trusts anything the client claims about who it is.
async function isAuthed() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  return verifySessionToken(token)
}

const FILES = {
  featured: 'content/tributes-featured.json',
  approved: 'content/tributes-approved.json',
  pending: 'content/tributes-pending.json',
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [featured, approved, pending] = await Promise.all([
    readJsonFile(FILES.featured, []),
    readJsonFile(FILES.approved, []),
    readJsonFile(FILES.pending, []),
  ])

  return NextResponse.json({ featured, approved, pending })
}

export async function POST(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const action = body?.action

  try {
    switch (action) {
      case 'approve': {
        const { id } = body
        const pending = await readJsonFile(FILES.pending, [])
        const item = pending.find((p) => p.id === id)
        if (!item) return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })

        const approved = await readJsonFile(FILES.approved, [])
        approved.unshift({ ...item, approvedAt: new Date().toISOString() })
        const newPending = pending.filter((p) => p.id !== id)

        const r1 = await writeJsonFile(FILES.approved, approved, `Approve tribute from ${item.name}`)
        if (!r1.ok) return NextResponse.json({ error: r1.error }, { status: 500 })
        const r2 = await writeJsonFile(FILES.pending, newPending, `Remove approved tribute from pending queue`)
        if (!r2.ok) return NextResponse.json({ error: r2.error }, { status: 500 })
        break
      }

      case 'reject': {
        const { id } = body
        const pending = await readJsonFile(FILES.pending, [])
        const newPending = pending.filter((p) => p.id !== id)
        const r = await writeJsonFile(FILES.pending, newPending, 'Reject tribute submission')
        if (!r.ok) return NextResponse.json({ error: r.error }, { status: 500 })
        break
      }

      case 'feature-from-approved': {
        const { id } = body
        const approved = await readJsonFile(FILES.approved, [])
        const item = approved.find((a) => a.id === id)
        if (!item) return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })

        const images = Array.isArray(item.imageUrls) && item.imageUrls.length > 0
          ? item.imageUrls
          : (item.imageUrl ? [item.imageUrl] : [])

        const featured = await readJsonFile(FILES.featured, [])
        featured.push({
          id: randomUUID(),
          title: item.displayPreference === 'anonymous' ? 'A Memory from a Former Student' : `A Memory from ${item.name}`,
          url: item.link || '',
          description: item.story || item.linkDescription || '',
          imageUrl: images[0] || null,
          addedAt: new Date().toISOString(),
          sourceApprovedId: item.id,
        })
        const r = await writeJsonFile(FILES.featured, featured, `Feature approved tribute from ${item.name}`)
        if (!r.ok) return NextResponse.json({ error: r.error }, { status: 500 })
        break
      }

      case 'delete-approved': {
        const { id } = body
        const approved = await readJsonFile(FILES.approved, [])
        const updated = approved.filter((a) => a.id !== id)
        const r = await writeJsonFile(FILES.approved, updated, 'Remove approved tribute')
        if (!r.ok) return NextResponse.json({ error: r.error }, { status: 500 })
        break
      }

      case 'add-featured': {
        const { title, url, description, imageUrl } = body
        if (!title || !String(title).trim()) {
          return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
        }
        const featured = await readJsonFile(FILES.featured, [])
        featured.push({
          id: randomUUID(),
          title: String(title).trim().slice(0, 200),
          url: url ? String(url).trim().slice(0, 500) : '',
          description: description ? String(description).trim().slice(0, 1000) : '',
          imageUrl: imageUrl || null,
          addedAt: new Date().toISOString(),
        })
        const r = await writeJsonFile(FILES.featured, featured, 'Add featured tribute content')
        if (!r.ok) return NextResponse.json({ error: r.error }, { status: 500 })
        break
      }

      case 'edit-featured': {
        const { id, title, url, description, imageUrl } = body
        const featured = await readJsonFile(FILES.featured, [])
        const idx = featured.findIndex((f) => f.id === id)
        if (idx === -1) return NextResponse.json({ error: 'Item not found.' }, { status: 404 })
        featured[idx] = {
          ...featured[idx],
          title: String(title || '').trim().slice(0, 200),
          url: url ? String(url).trim().slice(0, 500) : '',
          description: description ? String(description).trim().slice(0, 1000) : '',
          imageUrl: imageUrl || featured[idx].imageUrl || null,
        }
        const r = await writeJsonFile(FILES.featured, featured, 'Edit featured tribute content')
        if (!r.ok) return NextResponse.json({ error: r.error }, { status: 500 })
        break
      }

      case 'delete-featured': {
        const { id } = body
        const featured = await readJsonFile(FILES.featured, [])
        const updated = featured.filter((f) => f.id !== id)
        const r = await writeJsonFile(FILES.featured, updated, 'Remove featured tribute content')
        if (!r.ok) return NextResponse.json({ error: r.error }, { status: 500 })
        break
      }

      default:
        return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin tributes action failed:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
