'use client'

import { useState } from 'react'
import { uploadImageToBlob } from '@/lib/blobUpload'

export default function TributeSubmissionForm() {
  const [form, setForm] = useState({
    name: '', displayPreference: 'named', connection: '',
    story: '', link: '', website: '', // "website" is the honeypot field
  })
  const [imageFile, setImageFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImageToBlob(imageFile)
      }

      const res = await fetch('/api/tributes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrl }),
      })
      const json = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('done')
      } else {
        setError(json.error || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch (err) {
      setError('Something went wrong uploading your photo. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="success-box">
        Thank you for sharing this. It will be reviewed before it appears on
        the page — we read every submission.
      </div>
    )
  }

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      {/* Honeypot — hidden from real visitors via CSS, but a bot filling
          out every field in a scraped form will fill this one in too. */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="t-name">Name *</label>
        <input id="t-name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="t-display">Display preference *</label>
        <select
          id="t-display"
          value={form.displayPreference}
          onChange={(e) => update('displayPreference', e.target.value)}
        >
          <option value="named">Display my name</option>
          <option value="anonymous">Post anonymously</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="t-connection">How did you know him? (optional)</label>
        <input id="t-connection" value={form.connection} onChange={(e) => update('connection', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="t-story">Your memory (optional if you're sharing a link instead)</label>
        <textarea id="t-story" value={form.story} onChange={(e) => update('story', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="t-link">Link to an article, recording, or tribute (optional)</label>
        <input
          id="t-link"
          type="url"
          placeholder="https://…"
          value={form.link}
          onChange={(e) => update('link', e.target.value)}
        />
        <p className="form-note" style={{ marginTop: 6 }}>
          We&rsquo;ll try to pull a preview image from the link automatically —
          or upload your own photo below and we&rsquo;ll use that instead.
        </p>
      </div>

      <div className="field">
        <label htmlFor="t-image">Photo (optional)</label>
        <input
          id="t-image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Share This'}
      </button>
      {status === 'error' && <p className="form-note" style={{ color: '#8a2f2f' }}>{error}</p>}
    </form>
  )
}
