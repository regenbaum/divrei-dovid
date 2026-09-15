import InkDivider from '@/components/InkDivider'
import TributeSubmissionForm from '@/components/TributeSubmissionForm'
import TributeCard from '@/components/TributeCard'
import content from '@/content/site-content.json'
import featured from '@/content/tributes-featured.json'
import approved from '@/content/tributes-approved.json'

export const metadata = { title: 'Memories & Tributes' }

export default function TributesPage() {
  const { tributes: t } = content

  return (
    <div className="page">
      <p className="label">In Memoriam</p>
      <h1>{t.heading}</h1>
      <p className="subtitle">{t.subtitle}</p>

      <p>{t.intro}</p>
      <p>
        <a className="btn btn-primary" href="#share-memory">{t.shareButtonLabel}</a>
      </p>

      {featured.length > 0 && (
        <>
          <InkDivider />
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

      <h2>{t.sharedHeading}</h2>
      {approved.length === 0 ? (
        <p className="muted">
          Be the first to share a memory. Approved submissions will appear
          here.
        </p>
      ) : (
        approved.map((item) => <TributeCard item={item} key={item.id} />)
      )}

      <InkDivider />

      <div id="share-memory">
        <h2>{t.eyebrow}</h2>
        <TributeSubmissionForm />
      </div>
    </div>
  )
}
