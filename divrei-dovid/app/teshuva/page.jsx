import InkDivider from '@/components/InkDivider'
import RichText from '@/components/RichText'
import content from '@/content/site-content.json'

export const metadata = {
  title: 'The Dance of Teshuva',
  description: 'An 1840 reader of Rav David Ebner\'s essays and poems on teshuva, for the Yamim Noraim.',
}

export default function TeshuvaPage() {
  const { teshuva } = content
  return (
    <div className="page">
      <p className="label">{teshuva.eyebrow}</p>
      <h1>The Dance of Teshuva</h1>

      <RichText text={teshuva.intro} />

      <InkDivider />

      <h2 style={{ marginTop: 12 }}>Request Copies</h2>
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
