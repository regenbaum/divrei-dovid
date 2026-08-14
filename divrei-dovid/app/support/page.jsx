import ContactForm from '@/components/ContactForm'

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
  return (
    <div className="page">
      <h1>Help Carry This Forward</h1>
      <p>
        There&rsquo;s no single way to help. Some people have an hour a week
        to help transcribe or organize. Some are in a position to help
        sustain the hosting and printing costs going forward. Some just want
        to say hello. All of it matters — we read every message.
      </p>
      <ContactForm
        formId={process.env.NEXT_PUBLIC_FORMSPREE_SUPPORT_ID}
        fields={FIELDS}
        submitLabel="Send"
      />
    </div>
  )
}
