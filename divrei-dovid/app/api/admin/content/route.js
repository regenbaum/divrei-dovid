import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/adminAuth'
import currentContent from '@/content/site-content.json'

async function isAuthed() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  return verifySessionToken(token)
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(currentContent)
}

export async function POST(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updated = await req.json().catch(() => null)
  if (!updated || typeof updated !== 'object') {
    return NextResponse.json({ error: 'Invalid content payload.' }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  // NOTE: this path is relative to the repo root, not to Vercel's Root
  // Directory setting — that's why it's prefixed with the project's
  // subfolder. See README.md if this ever needs to change.
  const path = process.env.GITHUB_CONTENT_PATH || 'divrei-dovid/content/site-content.json'

  if (!token || !owner || !repo) {
    return NextResponse.json(
      {
        error:
          'GitHub is not configured yet (GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO environment variables are missing). See README.md for setup steps.',
      },
      { status: 500 }
    )
  }

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers, cache: 'no-store' })
  if (!getRes.ok) {
    const detail = await getRes.text()
    return NextResponse.json(
      { error: `Could not read the current file from GitHub (${getRes.status}): ${detail}` },
      { status: 500 }
    )
  }
  const current = await getRes.json()

  const newContentB64 = Buffer.from(JSON.stringify(updated, null, 2) + '\n').toString('base64')

  const putRes = await fetch(apiBase, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: 'Update site content via admin panel',
      content: newContentB64,
      sha: current.sha,
      branch,
    }),
  })

  if (!putRes.ok) {
    const detail = await putRes.text()
    return NextResponse.json(
      { error: `GitHub commit failed (${putRes.status}): ${detail}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
