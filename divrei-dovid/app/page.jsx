import Link from 'next/link'
import InkBlot from '@/components/InkBlot'
import InkDivider from '@/components/InkDivider'
import content from '@/content/site-content.json'

export default function HomePage() {
  const { home } = content

  return (
    <>
      <section className="hero">
        <InkBlot />
        <p className="label">{home.heroLabel}</p>
        <h1 className="hebrew-title">דברי דוד</h1>
        <h2 className="hero-sub">Divrei Dovid</h2>
        <p className="hero-copy">{home.heroCopy}</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/shiurim">Browse the Shiurim</Link>
          <Link className="btn btn-outline" href="/writings">Read His Writings</Link>
        </div>
      </section>

      <InkDivider />

      <section className="feature-strip">
        <Link href="/shiurim" className="feature">
          <div className="feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
              <rect x="2.5" y="14" width="4" height="6" rx="1.2" />
              <rect x="17.5" y="14" width="4" height="6" rx="1.2" />
            </svg>
          </div>
          <h3>Recorded Shiurim</h3>
          <p>Hours of chavrutot and shiurim, gradually being organized and made accessible.</p>
        </Link>
        <Link href="/writings" className="feature">
          <div className="feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 5.5c2.5-1 5-1 7 0v14c-2-1-4.5-1-7 0z" />
              <path d="M20 5.5c-2.5-1-5-1-7 0v14c2-1 4.5-1 7 0z" />
            </svg>
          </div>
          <h3>Writings &amp; Poetry</h3>
          <p>Essays, marginalia, and three published collections of his poetry.</p>
        </Link>
        <Link href="/teshuva" className="feature">
          <div className="feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M20 3 4 12l7 2 2 7z" />
            </svg>
          </div>
          <h3>The Dance of Teshuva</h3>
          <p>A new reader of his essays and poems on teshuva, for the Yamim Noraim.</p>
        </Link>
      </section>

      <InkDivider />

      <section className="quote-section">
        <div className="quote-mark">&ldquo;</div>
        <p className="quote-text">{home.quoteText}</p>
        <p className="quote-attr">{home.quoteAttribution}</p>
      </section>

      <section className="callout">
        <div>
          <p className="label" style={{ marginBottom: 10 }}>{home.calloutLabel}</p>
          <h3>{home.calloutTitle}</h3>
          <p>{home.calloutCopy}</p>
        </div>
        <Link className="btn btn-gold" href="/teshuva">Request Copies</Link>
      </section>
    </>
  )
}
