'use client'

import { useState } from 'react'
import { uploadImageToBlob } from '@/lib/blobUpload'

const MAX_PHOTOS = 3
const MAX_PHOTO_BYTES = 8 * 1024 * 1024

export default function TributeSubmissionForm() {
  const [form, setForm] = useState({
    name: '', displayPreference: 'named', connection: '',
    story: '', link: '', website: '', // "website" is the honeypot field
  })
  const [imageFiles, setImageFiles] = useState([])
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleFilesChange(e) {
    const picked = Array.from(e.target.files || [])
    if (picked.length === 0) return

    const accepted = []
    for (const file of picked) {
      const isHeic = /\.(heic|heif)$/i.test(file.name) || /heic|heif/i.test(file.type)
      if (isHeic) {
        setError(
          'One of those looks like an iPhone HEIC photo, which most browsers can\u2019t display. ' +
          'On your phone: open it in Photos, tap Share, then "Save to Files" or email it to ' +
          'yourself \u2014 both usually convert it to JPEG. Then upload that instead.'
        )
        setStatus('error')
        continue
      }
      if (file.size > MAX_PHOTO_BYTES) {
        setError(`"${file.name}" is larger than 8MB. Please choose a smaller photo.`)
        setStatus('error')
        continue
      }
      accepted.push(file)
    }

    setImageFiles((prev) => {
      const combined = [...prev, ...accepted]
      if (combined.length > MAX_PHOTOS) {
        setError(`Only up to ${MAX_PHOTOS} photos per submission \u2014 using the first ${MAX_PHOTOS}.`)
        setStatus('error')
        return combined.slice(0, MAX_PHOTOS)
      }
      return combined
    })
    e.target.value = ''
  }

  function removeImage(index) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')

    let imageUrls = []
    if (imageFiles.length > 0) {
      try {
        imageUrls = await Promise.all(imageFiles.map((f) => uploadImageToBlob(f)))
      } catch (err) {
        setError('Uploading your photos failed: ' + (err?.message || 'unknown error') + '. You can try again, or share your memory without photos.')
        setStatus('error')
        return
      }
    }

    try {
      const res = await fetch('/api/tributes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrls }),
      })
      const json = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('done')
      } else {
        setError(json.error || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch (err) {
      setError('Network error submitting the form: ' + (err?.message || 'unknown error') + '. Please try again.')
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
        <label htmlFor="t-story">Your memory (optional if you're sharing a link or photo instead)</label>
        <textarea id="t-story" rows={6} value={form.story} onChange={(e) => update('story', e.target.value)} />
        <p className="form-note" style={{ marginTop: 6 }}>
          Paragraph breaks, indenting, and numbered points (like &ldquo;1. &hellip; 2. &hellip;&rdquo;)
          will display exactly as you type them.
        </p>
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
          We&rsquo;ll try to pull a preview image from the link automatically (for
          a YouTube link, for example, that&rsquo;s its video thumbnail) &mdash; or
          upload your own photo below and we&rsquo;ll use that instead.
        </p>
      </div>

      <div className="field">
        <label htmlFor="t-image">Photos (optional)</label>
        <input
          id="t-image"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFilesChange}
          disabled={imageFiles.length >= MAX_PHOTOS}
        />
        <p className="form-note" style={{ marginTop: 6 }}>
          Up to {MAX_PHOTOS} photos, 8MB each.
        </p>
        {imageFiles.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            {imageFiles.map((file, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  style={{ width: 90, height: 90, objectFit: 'cover', border: '1px solid var(--border-strong)' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label={`Remove ${file.name}`}
                  style={{
                    position: 'absolute', top: -8, right: -8, width: 22, height: 22,
                    borderRadius: '50%', border: '1px solid var(--border-strong)',
                    background: '#fff', cursor: 'pointer', fontSize: 12, lineHeight: 1,
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Share This'}
      </button>
      {status === 'error' && <p className="form-note" style={{ color: '#8a2f2f' }}>{error}</p>}
    </form>
  )
}
