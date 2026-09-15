import InkDivider from '@/components/InkDivider'
import RichText from '@/components/RichText'
import content from '@/content/site-content.json'

export const metadata = {
  title: 'The Dance of Teshuva',
  description: 'An essay and poetry reader by Rav David Ebner zt"l on the Days of Awe, produced in partnership with 18Forty.',
}

export default function TeshuvaPage() {
  const { teshuva } = content
  return (
    <div className="page">
      <p className="label">{teshuva.eyebrow}</p>
      <h1>{teshuva.heading}</h1>

      <figure className="portrait-frame" style={{ width: 280 }}>
        <img
          src="/dance-of-teshuva-cover.jpg"
          alt="Cover of The Dance of Teshuva: Essays & Poetry by Rav David Ebner zt&quot;l, presented by 18Forty"
        />
        <figcaption>The Dance of Teshuva &middot; Essays &amp; Poetry</figcaption>
      </figure>

      <RichText text={teshuva.intro} />

      <InkDivider />

      <h2>{teshuva.partnershipHeading}</h2>
      <RichText text={teshuva.partnershipText} />
      <p>
        <a href="https://18forty.org/articles/the-dance-of-teshuva/" target="_blank" rel="noreferrer">
          {teshuva.articleLinkLabel}
        </a>
      </p>

      <InkDivider />

      <h2>{teshuva.introEssayHeading}</h2>
      <RichText text={teshuva.introEssayText} />
      <p>
        <a href="https://mijal.substack.com/p/the-dance-of-teshuva-rabbi-ebners" target="_blank" rel="noreferrer">
          {teshuva.introEssayLinkLabel}
        </a>
      </p>

      <InkDivider />

      <h2 style={{ marginTop: 12 }}>{teshuva.formHeading}</h2>
      <div className="form-box" style={{ padding: 0 }}>
        <iframe
          title="Request copies of The Dance of Teshuva"
          src="https://docs.google.com/forms/d/e/1FAIpQLSfhfSuQ-F4QUjLICptA4cUxxlaCRcx86hMA-R19uig2MGO--w/viewform?embedded=true"
          width="100%"
          height="900"
          style={{ border: 'none', display: 'block' }}
        >
          Loading form&hellip;
        </iframe>
      </div>
    </div>
  )
}
