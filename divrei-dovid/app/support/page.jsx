import ContactForm from '@/components/ContactForm'
import InkDivider from '@/components/InkDivider'
import content from '@/content/site-content.json'

export const metadata = { title: 'Support the Project' }

const FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  {
    name: 'help',
    label: 'How would you like to help?',
    type: 'select',
    required: true,
    options: [
      "I'd like to volunteer (organizing, transcribing, tech)",
      "I'd like to help sustain the project (hosting, printing costs)",
      'I represent an institution interested in partnering',
      'Just want to say hello',
    ],
  },
  { name: 'message', label: 'Message', type: 'textarea', required: false },
]

export default function SupportPage() {
  const { support } = content
  return (
    <div className="page">
      <p className="label">{support.eyebrow}</p>
      <h1>Help Carry This Forward</h1>
      <p>{support.intro}</p>

      <InkDivider />

      <ContactForm
        formId={process.env.NEXT_PUBLIC_FORMSPREE_SUPPORT_ID}
        fields={FIELDS}
        submitLabel="Send"
      />
    </div>
  )
}
