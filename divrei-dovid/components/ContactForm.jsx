'use client'

import { useState } from 'react'

// A single reusable form used by Support, Contribute, and Tributes.
// Posts to Formspree (https://formspree.io) — a free service that emails
// submissions directly to you without ever exposing your email address
// anywhere in the page's HTML. Create a form at formspree.io, then paste
// its ID into .env.local as the matching NEXT_PUBLIC_FORMSPREE_*_ID.
//
// Until a real formId is set, the form shows a friendly "not connected yet"
// notice instead of failing silently.
export default function ContactForm({ formId, fields, submitLabel = 'Send' }) {
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  if (!formId) {
    return (
      <div className="form-box">
        <p className="form-note">
          This form isn&rsquo;t connected yet. Create a free form at{' '}
          <a href="https://formspree.io" target="_blank" rel="noreferrer">formspree.io</a>{' '}
          and add its ID to your environment variables — see README.md.
        </p>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const form = e.target
    const data = new FormData(form)
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (res.ok) {
        setStatus('done')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="success-box">
        Thank you — this has been sent. We read every message and will be in
        touch if there&rsquo;s anything to follow up on.
      </div>
    )
  }

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      {fields.map((f) => (
        <div className="field" key={f.name}>
          <label htmlFor={f.name}>{f.label}{f.required ? ' *' : ''}</label>
          {f.type === 'textarea' ? (
            <textarea id={f.name} name={f.name} required={f.required} />
          ) : f.type === 'select' ? (
            <select id={f.name} name={f.name} required={f.required} defaultValue="">
              <option value="" disabled>Choose&hellip;</option>
              {f.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input id={f.name} type={f.type || 'text'} name={f.name} required={f.required} />
          )}
        </div>
      ))}
      <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : submitLabel}
      </button>
      {status === 'error' && (
        <p className="form-note">Something went wrong sending that — please try again.</p>
      )}
    </form>
  )
}
