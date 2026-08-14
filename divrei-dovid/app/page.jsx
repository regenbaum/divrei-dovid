import Link from 'next/link'
import { getFeaturedShiurim } from '@/lib/content'

export default async function HomePage() {
  const featured = await getFeaturedShiurim()

  return (
    <>
      <section className="hero">
        <p className="label">The Torah &amp; Legacy of Rabbi David Ebner zt&quot;l</p>
        <h1 className="hebrew-title">דברי דוד</h1>
        <h2 className="hero-sub">Divrei Dovid</h2>
        <p className="hero-copy">
          A growing digital home for the shiurim, writings, and poetry of
          Rabbi David Ebner — preserved for his students, and for those who
          never had the chance to learn from him.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/shiurim">Browse the Shiurim</Link>
          <Link className="btn btn-outline" href="/writings">Read His Writings</Link>
        </div>
      </section>

      <section className="section">
        <p className="label">Featured Shiurim</p>
        <div className="card-grid">
          {featured.every((s) => !s.viewUrl) && (
            <p className="muted">
              Featured shiurim will appear here once real Drive file IDs are
              set in <code>lib/featured.js</code>.
            </p>
          )}
          {featured.map((s, i) => (
            <a
              key={s.driveFileId || i}
              href={s.viewUrl || '#'}
              className="card"
              target={s.viewUrl ? '_blank' : undefined}
              rel="noreferrer"
            >
              <p className="card-title">{s.title}</p>
              {s.description && <p className="card-desc">{s.description}</p>}
            </a>
          ))}
        </div>
      </section>

      <section className="callout">
        <div>
          <p className="label label-light">New · For the Yamim Noraim</p>
          <h3>The Dance of Teshuva</h3>
          <p>
            An 1840 reader of Rav Ebner&rsquo;s essays and poems on teshuva,
            with an introduction by Rabbi Dovid Bashevkin.
          </p>
        </div>
        <Link className="btn btn-gold" href="/teshuva">Request Copies</Link>
      </section>
    </>
  )
}
