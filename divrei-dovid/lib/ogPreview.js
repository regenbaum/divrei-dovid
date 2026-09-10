// Fetches a submitted link server-side and pulls its Open Graph preview
// (image/title/description) — best effort, like how pasting a link into
// Slack or Twitter shows a card. Two things matter for safety here:
//
// 1. isSafeHttpUrl() is the ONLY thing that decides whether a submitted
//    "link" is allowed at all. It must run before this URL is stored,
//    rendered as an <a href>, or fetched — a URL like javascript:alert(1)
//    or data:text/html,... must never pass this check.
// 2. The fetch itself is bounded (timeout + size cap) so a slow or huge
//    response can't hang a request.

export function isSafeHttpUrl(value) {
  if (!value || typeof value !== 'string') return false
  let url
  try {
    url = new URL(value.trim())
  } catch {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

const FETCH_TIMEOUT_MS = 6000
const MAX_HTML_BYTES = 500_000 // 500KB is plenty for <head> metadata

function resolveMaybeRelative(url, base) {
  try {
    return new URL(url, base).toString()
  } catch {
    return null
  }
}

function extractMeta(html, ...names) {
  for (const name of names) {
    const patterns = [
      new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${name}["']`, 'i'),
      new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'),
    ]
    for (const re of patterns) {
      const match = html.match(re)
      if (match) return match[1]
    }
  }
  return null
}

export async function fetchLinkPreview(rawUrl) {
  if (!isSafeHttpUrl(rawUrl)) return null

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const res = await fetch(rawUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DivreiDovidLinkPreview/1.0)',
      },
    })
    clearTimeout(timeout)

    if (!res.ok) return null

    const finalUrl = res.url || rawUrl
    // Only read the first chunk — we just need <head>, not the whole page.
    const reader = res.body?.getReader()
    let html = ''
    if (reader) {
      let received = 0
      while (received < MAX_HTML_BYTES) {
        const { done, value } = await reader.read()
        if (done) break
        html += Buffer.from(value).toString('utf-8')
        received += value.length
        if (html.includes('</head>')) break
      }
      reader.cancel().catch(() => {})
    } else {
      html = await res.text()
    }

    const title = extractMeta(html, 'og:title', 'twitter:title')
    const description = extractMeta(html, 'og:description', 'twitter:description', 'description')
    let image = extractMeta(html, 'og:image', 'twitter:image')
    if (image) {
      image = resolveMaybeRelative(image, finalUrl)
      // Re-validate: some sites put unsafe schemes in og:image too.
      if (image && !isSafeHttpUrl(image)) image = null
    }

    if (!title && !description && !image) return null
    return { title, description, image }
  } catch {
    return null // slow/unreachable/blocked sites just get no preview
  }
}
