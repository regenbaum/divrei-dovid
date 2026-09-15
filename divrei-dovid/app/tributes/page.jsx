import InkDivider from '@/components/InkDivider'
import TributeSubmissionForm from '@/components/TributeSubmissionForm'
import content from '@/content/site-content.json'
import featured from '@/content/tributes-featured.json'
import approved from '@/content/tributes-approved.json'

export const metadata = { title: 'Memories & Tributes' }

// Supports both the new "imageUrls" array and older single-"imageUrl"
// entries, so nothing already saved ever breaks when this shape changes.
function imagesOf(item) {
  if (Array.isArray(item.imageUrls) && item.imageUrls.length > 0) return item.imageUrls
  if (item.imageUrl) return [item.imageUrl]
  return []
}

export default function TributesPage() {
  const { tributes: t } = content

  return (
    <div className="page">
      <p className="label">In Memoriam</p>
      <h1>{t.heading}</h1>
      <p className="subtitle">{t.subtitle}</p>

      {featured.length > 0 && (
        <>
          <h2 style={{ marginTop: 8 }}>{t.featuredHeading}</h2>
          <div className="card-grid">
            {featured.map((item) => (
              <a
                key={item.id}
                className="card"
                href={item.url || '#'}
                target={item.url ? '_blank' : undefined}
                rel="noreferrer"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    style={{ width: '100%', marginBottom: 12, border: '1px solid var(--border)' }}
                  />
                )}
                <p className="card-title">{item.title}</p>
                {item.description && <p className="card-desc">{item.description}</p>}
              </a>
            ))}
          </div>
        </>
      )}

      <InkDivider />

      <h2>{t.eyebrow}</h2>
      <p>{t.intro}</p>

      <TributeSubmissionForm />

      <h2 style={{ marginTop: 44 }}>{t.sharedHeading}</h2>
      {approved.length === 0 ? (
        <p className="muted">
          Be the first to share a memory. Approved submissions will appear
          here.
        </p>
      ) : (
        approved.map((item) => {
          const images = imagesOf(item)
          return (
            <div className="tribute" key={item.id}>
              {images.length > 0 && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                  {images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      style={{ width: 160, height: 160, objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                  ))}
                </div>
              )}
              {item.story && <p>&ldquo;{item.story}&rdquo;</p>}
              {item.link && (
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14 }}>
                  <a href={item.link} target="_blank" rel="noreferrer">{item.linkTitle || item.link}</a>
                  {item.linkDescription && <><br />{item.linkDescription}</>}
                </p>
              )}
              <p className="who">
                &mdash; {item.displayPreference === 'anonymous' ? 'A former student' : item.name}
                {item.connection ? `, ${item.connection}` : ''}
              </p>
            </div>
          )
        })
      )}
    </div>
  )
}
