// Shared helper for reading/writing JSON files in the GitHub repo via the
// Contents API. Both the site-text editor and the tributes moderation
// system use this — every admin action that changes published content
// works the same way: read the current file's sha, then PUT the update.
// Every call re-checks the session server-side; nothing here trusts the
// caller to have already verified auth.

const BASE_PATH_PREFIX = process.env.GITHUB_BASE_PATH || 'divrei-dovid'

function githubConfig() {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  if (!token || !owner || !repo) return null
  return { token, owner, repo, branch }
}

export function isGithubConfigured() {
  return githubConfig() !== null
}

async function githubRequest(path, options = {}) {
  const cfg = githubConfig()
  if (!cfg) {
    throw new Error(
      'GitHub is not configured (GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO). See README.md.'
    )
  }
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${BASE_PATH_PREFIX}/${path}`
  const headers = {
    Authorization: `Bearer ${cfg.token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...options.headers,
  }
  return fetch(url, { ...options, headers })
}

export async function readJsonFile(path, fallback) {
  const cfg = githubConfig()
  if (!cfg) return fallback
  try {
    const res = await githubRequest(`${path}?ref=${cfg.branch}`, { cache: 'no-store' })
    if (!res.ok) return fallback
    const data = await res.json()
    const text = Buffer.from(data.content, 'base64').toString('utf-8')
    return JSON.parse(text)
  } catch {
    return fallback
  }
}

export async function writeJsonFile(path, value, message) {
  const cfg = githubConfig()
  if (!cfg) {
    return { ok: false, error: 'GitHub is not configured. See README.md.' }
  }

  // Need the current sha to update an existing file. If the file doesn't
  // exist yet, GitHub returns 404 and we create it fresh (no sha needed).
  let sha
  const getRes = await githubRequest(`${path}?ref=${cfg.branch}`, { cache: 'no-store' })
  if (getRes.ok) {
    const current = await getRes.json()
    sha = current.sha
  } else if (getRes.status !== 404) {
    const detail = await getRes.text()
    return { ok: false, error: `Could not read current file from GitHub (${getRes.status}): ${detail}` }
  }

  const contentB64 = Buffer.from(JSON.stringify(value, null, 2) + '\n').toString('base64')
  const putRes = await githubRequest(path, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: contentB64,
      branch: cfg.branch,
      ...(sha ? { sha } : {}),
    }),
  })

  if (!putRes.ok) {
    const detail = await putRes.text()
    return { ok: false, error: `GitHub commit failed (${putRes.status}): ${detail}` }
  }
  return { ok: true }
}
