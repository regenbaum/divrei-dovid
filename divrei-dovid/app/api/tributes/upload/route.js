import { NextResponse } from 'next/server'
import { handleUpload } from '@vercel/blob/client'

// Issues short-lived upload tokens so a submitter's browser can send a
// photo straight to Blob storage without the file passing through our
// own server function (which has a small request-size limit). The
// important part for safety is onBeforeGenerateToken below: it's the
// server, not the browser, that decides what file types and sizes are
// allowed — a modified client can't bypass this.
export async function POST(request) {
  const body = await request.json()

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          maximumSizeInBytes: 8 * 1024 * 1024, // 8MB
          addRandomSuffix: true,
          pathname: `tributes/${Date.now()}`,
        }
      },
      onUploadCompleted: async () => {
        // Nothing to do — the browser sends the resulting URL along with
        // the rest of the form in the /api/tributes/submit request.
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
