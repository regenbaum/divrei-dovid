'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function labelize(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

const SECTION_NAMES = {
  home: 'Home Page',
  about: 'About Page',
  writings: 'Writings Page',
  shiurim: 'Shiurim Page',
  teshuva: 'Teshuva Reader Page',
  getInvolved: 'Get Involved Page',
  support: 'Support Page',
  contribute: 'Contribute Page',
  tributes: 'Tributes Page',
}

export default function AdminDashboard() {
  const [content, setContent] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | saving | saved | error
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/content')
      .then(async (res) => {
        if (res.status === 401) {
          router.replace('/admin/login')
          return
        }
        const data = await res.json()
        if (!cancelled) {
          setContent(data)
          setStatus('ready')
        }
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => { cancelled = true }
  }, [router])

  function updateField(section, key, value) {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
  }

  async function handleSave() {
    setStatus('saving')
    setError('')
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('saved')
      } else {
        setError(data.error || 'Something went wrong saving your changes.')
        setStatus('error')
      }
    } catch {
      setError('Network error while saving.')
      setStatus('error')
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (status === 'loading') {
    return <div className="page"><p className="muted">Loading&hellip;</p></div>
  }

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="label">Admin</p>
          <h1>Edit Site Text</h1>
        </div>
        <button className="btn btn-outline" onClick={handleLogout} type="button">Log Out</button>
      </div>
      <p className="subtitle">
        Edit any text below, then click Save. Changes are committed directly
        to the site and go live after a short rebuild — usually well under a
        minute.
      </p>

      {content && Object.entries(content).map(([section, fields]) => (
        <div key={section} style={{ marginBottom: 40 }}>
          <h2>{SECTION_NAMES[section] || section}</h2>
          {Object.entries(fields).map(([key, value]) => (
            <div className="field" key={key}>
              <label htmlFor={`${section}-${key}`}>{labelize(key)}</label>
              <textarea
                id={`${section}-${key}`}
                value={value}
                onChange={(e) => updateField(section, key, e.target.value)}
                rows={value.length > 200 ? 9 : 3}
              />
            </div>
          ))}
        </div>
      ))}

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: 'var(--cream)',
          paddingTop: 16,
          paddingBottom: 24,
          borderTop: '1px solid var(--border)',
        }}
      >
        <button className="btn btn-primary" onClick={handleSave} type="button" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save Changes'}
        </button>
        {status === 'saved' && (
          <span className="form-note" style={{ marginLeft: 14 }}>
            Saved! The live site will update shortly.
          </span>
        )}
        {status === 'error' && (
          <span className="form-note" style={{ marginLeft: 14, color: '#8a2f2f' }}>
            {error}
          </span>
        )}
      </div>
    </div>
  )
}
