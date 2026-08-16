import { NextResponse } from 'next/server'
import { checkPassword, createSessionToken, SESSION_COOKIE } from '@/lib/adminAuth'

export async function POST(req) {
  const body = await req.json().catch(() => ({}))
  const { password } = body

  if (!checkPassword(password)) {
    // Small delay to make brute-forcing a bit less convenient. Not a
    // substitute for a strong password, just a minor speed bump.
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const token = createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
