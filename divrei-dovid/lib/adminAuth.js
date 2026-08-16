import crypto from 'crypto'

export const SESSION_COOKIE = 'admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not set. See README.md.')
  }
  return secret
}

// Timing-safe password check. Hashing both sides first means we're always
// comparing equal-length buffers, so timingSafeEqual never throws even if
// someone submits a password of a different length than the real one.
export function checkPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD || ''
  if (!expected) return false
  const a = crypto.createHash('sha256').update(String(candidate || '')).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}

export function createSessionToken() {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })
  const payloadB64 = Buffer.from(payload).toString('base64url')
  const sig = crypto.createHmac('sha256', getSecret()).update(payloadB64).digest('base64url')
  return `${payloadB64}.${sig}`
}

export function verifySessionToken(token) {
  if (!token || !token.includes('.')) return false
  const [payloadB64, sig] = token.split('.')
  if (!payloadB64 || !sig) return false

  let expectedSig
  try {
    expectedSig = crypto.createHmac('sha256', getSecret()).update(payloadB64).digest('base64url')
  } catch {
    return false
  }

  const a = Buffer.from(sig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}
