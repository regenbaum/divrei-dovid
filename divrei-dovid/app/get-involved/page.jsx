import Link from 'next/link'
import InkDivider from '@/components/InkDivider'
import content from '@/content/site-content.json'

export const metadata = { title: 'Get Involved' }

export default function GetInvolvedPage() {
  const { getInvolved } = content
  return (
    <div className="page">
      <p className="label">{getInvolved.eyebrow}</p>
      <h1>{getInvolved.heading}</h1>
      <p className="subtitle">{getInvolved.intro}</p>

      <InkDivider />

      <div className="involve-grid">
        <Link className="involve-card" href="/contribute">
          <h3>{getInvolved.card1Title}</h3>
          <p>{getInvolved.card1Desc}</p>
        </Link>
        <Link className="involve-card" href="/support">
          <h3>{getInvolved.card2Title}</h3>
          <p>{getInvolved.card2Desc}</p>
        </Link>
        <Link className="involve-card" href="/tributes">
          <h3>{getInvolved.card3Title}</h3>
          <p>{getInvolved.card3Desc}</p>
        </Link>
      </div>
    </div>
  )
}
