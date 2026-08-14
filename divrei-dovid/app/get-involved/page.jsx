import Link from 'next/link'

export const metadata = { title: 'Get Involved' }

export default function GetInvolvedPage() {
  return (
    <div className="page">
      <h1>Help Carry This Forward</h1>
      <p className="subtitle">
        Divrei Dovid is entirely a labor of love — built and maintained by
        students who learned from Rabbi Ebner and want his Torah to keep
        reaching people. There&rsquo;s no single way to help.
      </p>

      <div className="involve-grid">
        <Link className="involve-card" href="/contribute">
          <h3>Share a Recording or Writing</h3>
          <p>Have a recording, notes, or something he wrote sitting on an old drive? We&rsquo;d love to add it to the archive.</p>
        </Link>
        <Link className="involve-card" href="/support">
          <h3>Support the Project</h3>
          <p>Volunteer, help organize or transcribe, or help sustain the hosting and printing costs going forward.</p>
        </Link>
        <Link className="involve-card" href="/tributes">
          <h3>Share a Memory</h3>
          <p>If he taught you something you still carry, we&rsquo;d love for you to share it here.</p>
        </Link>
      </div>
    </div>
  )
}
