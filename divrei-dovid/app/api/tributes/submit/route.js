import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { readJsonFile, writeJsonFile } from '@/lib/githubContent'
import { isSafeHttpUrl, fetchLinkPreview } from '@/lib/ogPreview'

const MAX_LENGTHS = {
  name: 100,
  connection: 150,
  story: 5000,
  linkTitle: 150,
  linkDescription: 400,
}

function clean(value, maxLen) {
  if (typeof value !== 'string') return ''
  // Strip anything that looks like a tag. Everything here is rendered as
  // plain JSX text (never dangerouslySetInnerHTML), so this isn't the
  // only thing standing between a submission and the page — but it's a
  // sensible belt-and-suspenders step, and it means even the pending
  // queue an admin reviews never shows raw markup.
  return value.replace(/<[^>]*>/g, '').trim().slice(0, maxLen)
}

export async function POST(req) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
  }

  // Honeypot: a hidden field real visitors never see or fill in. If it's
  // filled in, this was almost certainly a bot — reject quietly without
  // revealing why, rather than saying "invalid" (which just teaches bots
  // to try again differently).
  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, MAX_LENGTHS.name)
  const displayPreference = body.displayPreference === 'anonymous' ? 'anonymous' : 'named'
  const connection = clean(body.connection, MAX_LENGTHS.connection)
  const story = clean(body.story, MAX_LENGTHS.story)
  const linkTitleInput = clean(body.linkTitle, MAX_LENGTHS.linkTitle)
  const linkDescriptionInput = clean(body.linkDescription, MAX_LENGTHS.linkDescription)

  let link = ''
  if (body.link && String(body.link).trim()) {
    const candidate = String(body.link).trim()
    if (!isSafeHttpUrl(candidate)) {
      return NextResponse.json({ error: 'That link doesn\u2019t look like a valid web address.' }, { status: 400 })
    }
    link = candidate
  }

  // imageUrl comes from the Blob upload step (see /api/tributes/upload) —
  // only accept it if it actually looks like an http(s) URL.
  const imageUrl = body.imageUrl && isSafeHttpUrl(body.imageUrl) ? body.imageUrl : null

  if (!name) {
    return NextResponse.json({ error: 'Please include your name.' }, { status: 400 })
  }
  if (!story && !link) {
    return NextResponse.json(
      { error: 'Please share a memory, a link, or both.' },
      { status: 400 }
    )
  }

  // Best-effort link preview — only fetched if the submitter didn't
  // already give us a title/description/image of their own.
  let linkPreview = null
  if (link && (!linkTitleInput || !imageUrl)) {
    linkPreview = await fetchLinkPreview(link)
  }

  const entry = {
    id: randomUUID(),
    name,
    displayPreference,
    connection,
    story,
    link,
    linkTitle: linkTitleInput || linkPreview?.title || '',
    linkDescription: linkDescriptionInput || linkPreview?.description || '',
    imageUrl: imageUrl || linkPreview?.image || null,
    submittedAt: new Date().toISOString(),
  }

  const pending = await readJsonFile('content/tributes-pending.json', [])
  pending.push(entry)

  const result = await writeJsonFile(
    'content/tributes-pending.json',
    pending,
    'New tribute submission awaiting approval'
  )

  if (!result.ok) {
    console.error('Failed to save tribute submission:', result.error)
    return NextResponse.json(
      { error: 'Something went wrong saving your submission. Please try again shortly.' },
      { status: 500 }
    )
  }

  // Notify the admin — best effort, reuses the existing Formspree "Tribute"
  // form so no new email service is needed. Never blocks the submission
  // itself if this fails.
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_TRIBUTE_ID
  if (formspreeId) {
    fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        subject: 'New tribute submission awaiting approval',
        name: entry.name,
        message: `A new tribute was submitted and is waiting for your review at /admin/tributes.\n\nName: ${entry.name}\nStory: ${entry.story || '(none)'}\nLink: ${entry.link || '(none)'}`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
