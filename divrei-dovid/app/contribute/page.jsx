import ContactForm from '@/components/ContactForm'

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
  return (
    <div className="page">
      <h1>Do You Have a Recording, or Something He Wrote?</h1>
      <p>
        If you learned with Rabbi Ebner — in a shiur, a chavruta, or a
        hallway conversation — there&rsquo;s a good chance you&rsquo;re
        sitting on something we don&rsquo;t have yet: an old cassette, a Zoom
        recording, typed-up notes, a letter, a poem he wrote you. We&rsquo;d
        love to add it to the archive.
      </p>
      <ContactForm
        formId={process.env.NEXT_PUBLIC_FORMSPREE_CONTRIBUTE_ID}
        fields={FIELDS}
        submitLabel="Send"
      />
    </div>
  )
}
