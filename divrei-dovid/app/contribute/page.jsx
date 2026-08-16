import ContactForm from '@/components/ContactForm'
import InkDivider from '@/components/InkDivider'
import content from '@/content/site-content.json'

export const metadata = { title: 'Contribute Material' }

const FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  {
    name: 'what',
    label: 'What do you have?',
    type: 'select',
    required: true,
    options: [
      'Audio recording',
      'Video recording',
      'Written notes or transcript',
      'A letter or personal correspondence',
      'Something else',
    ],
  },
  { name: 'details', label: 'Approximate date or topic, if known', required: false },
  {
    name: 'sharing',
    label: 'How would you like to share it?',
    type: 'select',
    required: true,
    options: [
      "I'll send a Drive/Dropbox link",
      'Please contact me to arrange transfer',
    ],
  },
  { name: 'notes', label: 'Anything else we should know?', type: 'textarea', required: false },
]

export default function ContributePage() {
  const { contribute } = content
  return (
    <div className="page">
      <p className="label">{contribute.eyebrow}</p>
      <h1>Do You Have a Recording, or Something He Wrote?</h1>
      <p>{contribute.intro}</p>

      <InkDivider />

      <ContactForm
        formId={process.env.NEXT_PUBLIC_FORMSPREE_CONTRIBUTE_ID}
        fields={FIELDS}
        submitLabel="Send"
      />
    </div>
  )
}
