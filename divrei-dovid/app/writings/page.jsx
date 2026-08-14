export const metadata = {
  title: 'Writings',
  description: 'Where to find Rabbi David Ebner\'s writings, poetry, and shiurim across the web.',
}

const RESOURCES = [
  {
    title: 'Recorded Shiurim Archive (Google Drive)',
    href: 'https://drive.google.com/drive/folders/1zIhSM2q9Kt-xAIa3muG7lZhbKBm70Q3s',
    desc: 'Our growing, still-being-organized archive of recorded shiurim and chavrutot.',
  },
  {
    title: 'WebYeshiva: Divrei Dovid — Marginalia Project',
    href: 'https://webyeshiva.org/divreidovid/',
    desc: 'Scans of his handwritten annotations in the margins of his own sefarim, curated by R. Jeffrey Saks.',
  },
  {
    title: "WebYeshiva: Rabbi Ebner's shiurim",
    href: 'https://webyeshiva.org/profile/?user=11821',
    desc: 'His recorded shiurim on the WebYeshiva platform.',
  },
  {
    title: 'YUTorah: Rabbi Dovid Ebner',
    href: 'https://www.yutorah.org/teachers/rabbi-dovid-ebner',
    desc: 'His shiurim archived on YUTorah.',
  },
  {
    title: 'Tradition Online',
    href: 'https://traditiononline.org/r-david-ebner-zl/',
    desc: 'His 1992 "Divided and Distinguished Worlds" symposium essay, and tributes.',
  },
  {
    title: 'ATID: The Library of Everything',
    href: 'http://www.atid.org/publications/libofevery.asp',
    desc: 'His poetry collection, with sample audio readings by the author.',
  },
  {
    title: 'YouTube: Recorded shiurim playlist',
    href: 'https://www.youtube.com/playlist?list=PLK1dVa0gpWGxMACNBMJrcmKkFYIkr2X8d',
    desc: 'A growing playlist of his recorded shiurim.',
  },
  {
    title: 'eParsha.com',
    href: 'https://eparsha.com/',
    desc: 'Additional recorded shiurim and Torah content.',
  },
]

export default function WritingsPage() {
  return (
    <div className="page">
      <h1>Where to Find His Torah</h1>
      <p className="subtitle">
        Several platforms already host pieces of Rabbi Ebner&rsquo;s legacy.
        This page brings them together in one place.
      </p>
      <ul className="resource-list">
        {RESOURCES.map((r) => (
          <li key={r.href}>
            <a className="r-title" href={r.href} target="_blank" rel="noreferrer">
              {r.title}
            </a>
            <div className="r-desc">{r.desc}</div>
          </li>
        ))}
      </ul>
      <p className="subtitle" style={{ marginTop: 30 }}>
        Also published: <em>The Library of Everything</em>,{' '}
        <em>Perhaps This Poem</em>, and <em>Dance Words</em> (poetry
        collections).
      </p>
    </div>
  )
}
