import ContactForm from '@/components/ContactForm'
import InkDivider from '@/components/InkDivider'
import content from '@/content/site-content.json'
import tributes from '@/data/tributes.json'

export const metadata = { title: 'Memories & Tributes' }

export default function TributesPage() {
  const { tributes: tributesContent } = content
  return (
    <div className="page">
      <p className="label">{tributesContent.eyebrow}</p>
      <h1>In His Own Students&rsquo; Words</h1>
      <p>{tributesContent.intro}</p>

      <ContactForm
        formId={process.env.NEXT_PUBLIC_FORMSPREE_TRIBUTE_ID}
        fields={[
          { name: 'name', label: 'Name', required: true },
          {
            name: 'display',
            label: 'Display preference',
            type: 'select',
            required: true,
            options: ['Display my name', 'Post anonymously'],
          },
          { name: 'connection', label: 'How did you know him? (optional)', required: false },
          { name: 'memory', label: 'Your memory or tribute', type: 'textarea', required: true },
        ]}
        submitLabel="Share This"
      />

      <InkDivider />

      <h2>Shared So Far</h2>
      {tributes.length === 0 ? (
        <p className="muted">
          Be the first to share a memory. Approved submissions will appear
          here.
        </p>
      ) : (
        tributes.map((t, i) => (
          <div className="tribute" key={i}>
            <p>&ldquo;{t.memory}&rdquo;</p>
            <p className="who">
              &mdash; {t.display === 'anonymous' ? 'A former student' : t.name}
              {t.connection ? `, ${t.connection}` : ''}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
