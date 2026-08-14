import { getAllShiurim } from '@/lib/content'
import ShiurimBrowser from '@/components/ShiurimBrowser'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Shiurim',
  description: 'Browse recorded shiurim and chavrutot by Rabbi David Ebner zt"l.',
}

export default async function ShiurimPage() {
  const shiurim = await getAllShiurim()

  return (
    <div className="page">
      <h1>Shiurim</h1>
      <p className="subtitle">
        {shiurim.length > 0
          ? `${shiurim.length} recorded shiurim and chavrutot, and growing.`
          : 'Our archive is still being connected — check back soon, or browse the Google Drive folder directly below.'}
      </p>

      {shiurim.length === 0 && (
        <p>
          In the meantime, the existing archive is available directly on{' '}
          <a
            href="https://drive.google.com/drive/folders/1zIhSM2q9Kt-xAIa3muG7lZhbKBm70Q3s"
            target="_blank"
            rel="noreferrer"
          >
            Google Drive
          </a>.
        </p>
      )}

      <ShiurimBrowser shiurim={shiurim} />
    </div>
  )
}
