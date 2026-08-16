import InkDivider from '@/components/InkDivider'
import RichText from '@/components/RichText'
import content from '@/content/site-content.json'

export const metadata = {
  title: 'About Rabbi David Ebner zt"l',
  description:
    'The life of Rabbi David (Dovid) Ebner zt"l, and the project preserving his Torah at Divrei Dovid.',
}

export default function AboutPage() {
  const { about } = content
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rabbi David Ebner',
    alternateName: 'Rav Dovid Ebner',
    birthDate: '1945',
    deathDate: '2025-09-07',
    deathPlace: 'Jerusalem, Israel',
    description:
      'Rosh Yeshiva and educator at Yeshivat HaMivtar and Yeshivat Eretz HaTzvi; poet; founder of ATID.',
    affiliation: [
      { '@type': 'Organization', name: 'Yeshivat HaMivtar' },
      { '@type': 'Organization', name: 'Yeshivat Eretz HaTzvi' },
      { '@type': 'Organization', name: 'ATID' },
    ],
  }

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="label">{about.eyebrow}</p>
      <h1>About This Project</h1>

      <RichText text={about.projectIntro} />

      <p><a className="btn btn-outline" href="/get-involved">Get Involved</a></p>

      <InkDivider />

      <p className="label">{about.bioEyebrow}</p>
      <h2 style={{ marginTop: 4 }}>Rabbi David Ebner zt&quot;l (1945&ndash;2025)</h2>

      <figure className="portrait-frame">
        <img src="/rabbi-ebner.jpg" alt="Rabbi David Ebner zt&quot;l" />
        <figcaption>Rabbi David Ebner zt&quot;l</figcaption>
      </figure>

      <RichText text={about.bioText} />

      <p style={{ textAlign: 'center', fontSize: '20px' }}>יהי זכרו ברוך</p>
      <p className="subtitle">{about.sourceNote}</p>
    </div>
  )
}
