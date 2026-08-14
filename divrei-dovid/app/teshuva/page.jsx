export const metadata = {
  title: 'The Dance of Teshuva',
  description: 'An 1840 reader of Rav David Ebner\'s essays and poems on teshuva, for the Yamim Noraim.',
}

export default function TeshuvaPage() {
  return (
    <div className="page">
      <h1>The Dance of Teshuva</h1>
      <p className="subtitle">An 1840 Reader for the Yamim Noraim</p>

      <p>
        We are excited to share a series of beautiful essays and poems on
        teshuva, written by Rav David Ebner zt&quot;l. Those who are familiar
        with Rav Ebner and his Torah know that his words have the power to
        reach the most seasoned teshuva-season participant, and those newer
        to the dance of repentance.
      </p>
      <p>
        We are grateful to our partners at 1840 for producing and
        distributing this reader, and are excited that it includes an
        introductory essay from Rabbi Dovid Bashevkin.
      </p>
      <p>
        Anonymous donors have sponsored the printing and distribution of
        these readers in Rav Ebner&rsquo;s memory. Our hope is that this
        reader will accompany daveners in shuls across the world this
        holiday season.
      </p>

      <h2>Request Copies</h2>
      <div className="form-box" style={{ padding: 0 }}>
        <iframe
          title="Request copies of The Dance of Teshuva"
          src="https://docs.google.com/forms/d/e/1FAIpQLSfhfSuQ-F4QUjLICptA4cUxxlaCRcx86hMA-R19uig2MGO--w/viewform?embedded=true"
          width="100%"
          height="900"
          style={{ border: 'none', display: 'block' }}
        >
          Loading form…
        </iframe>
      </div>
    </div>
  )
}
