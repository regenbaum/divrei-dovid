import InkDivider from '@/components/InkDivider'
import TributeSubmissionForm from '@/components/TributeSubmissionForm'
import content from '@/content/site-content.json'
import featured from '@/content/tributes-featured.json'
import approved from '@/content/tributes-approved.json'

export const metadata = { title: 'Memories & Tributes' }

export default function TributesPage() {
  const { tributes: tributesContent } = content

  return (
    <div className="page">
      <p className="label">In Memoriam</p>
      <h1>Memories &amp; Tributes</h1>
      <p className="subtitle">
        Recordings, articles, and memories shared in honor of Rabbi David
        Ebner zt&quot;l.
      </p>

      {featured.length > 0 && (
        <>
          <h2 style={{ marginTop: 8 }}>From Divrei Dovid</h2>
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

      <h2>{tributesContent.eyebrow}</h2>
      <p>{tributesContent.intro}</p>

      <TributeSubmissionForm />

      <h2 style={{ marginTop: 44 }}>Shared So Far</h2>
      {approved.length === 0 ? (
        <p className="muted">
          Be the first to share a memory. Approved submissions will appear
          here.
        </p>
      ) : (
        approved.map((t) => (
          <div className="tribute" key={t.id}>
            {t.imageUrl && (
              <img
                src={t.imageUrl}
                alt=""
                style={{ maxWidth: 240, marginBottom: 12, border: '1px solid var(--border)' }}
              />
            )}
            {t.story && <p>&ldquo;{t.story}&rdquo;</p>}
            {t.link && (
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14 }}>
                <a href={t.link} target="_blank" rel="noreferrer">{t.linkTitle || t.link}</a>
                {t.linkDescription && <><br />{t.linkDescription}</>}
              </p>
            )}
            <p className="who">
              &mdash; {t.displayPreference === 'anonymous' ? 'A former student' : t.name}
              {t.connection ? `, ${t.connection}` : ''}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
