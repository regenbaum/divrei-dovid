'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { uploadImageToBlob } from '@/lib/blobUpload'

const EDIT_FIELDS = ['name', 'connection', 'story', 'link', 'linkTitle', 'linkDescription']

export default function AdminTributesPage() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const [newItem, setNewItem] = useState({ title: '', url: '', description: '' })
  const [newImageFile, setNewImageFile] = useState(null)
  const [addingFeatured, setAddingFeatured] = useState(false)

  // editingKey is like "pending:<id>" or "approved:<id>" so pending and
  // approved items never collide even if edited around the same time.
  const [editingKey, setEditingKey] = useState(null)
  const [editForm, setEditForm] = useState({})

  function load() {
    fetch('/api/admin/tributes')
      .then(async (res) => {
        if (res.status === 401) {
          router.replace('/admin/login')
          return
        }
        const json = await res.json()
        setData(json)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(() => { load() }, [])

  async function runAction(payload) {
    setError('')
    setBusyId(payload.id || 'new')
    try {
      const res = await fetch('/api/admin/tributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || 'Something went wrong.')
      } else {
        await load()
      }
    } catch {
      setError('Network error.')
    } finally {
      setBusyId(null)
    }
  }

  function startEdit(section, item) {
    setEditingKey(`${section}:${item.id}`)
    const initial = {}
    for (const f of EDIT_FIELDS) initial[f] = item[f] || ''
    setEditForm(initial)
  }

  function cancelEdit() {
    setEditingKey(null)
    setEditForm({})
  }

  async function saveEdit(section, id) {
    const action = section === 'pending' ? 'edit-pending' : 'edit-approved'
    await runAction({ action, id, ...editForm })
    setEditingKey(null)
    setEditForm({})
  }

  async function handleAddFeatured() {
    if (!newItem.title.trim()) {
      setError('Title is required.')
      return
    }
    setAddingFeatured(true)
    setError('')
    try {
      let imageUrl = null
      if (newImageFile) {
        imageUrl = await uploadImageToBlob(newImageFile)
      }
      await runAction({ action: 'add-featured', ...newItem, imageUrl })
      setNewItem({ title: '', url: '', description: '' })
      setNewImageFile(null)
    } catch (err) {
      setError('Image upload failed: ' + err.message)
    } finally {
      setAddingFeatured(false)
    }
  }

  function EditForm({ section, id }) {
    return (
      <div>
        <div className="field">
          <label>Name</label>
          <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
        </div>
        <div className="field">
          <label>Connection</label>
          <input value={editForm.connection} onChange={(e) => setEditForm({ ...editForm, connection: e.target.value })} />
        </div>
        <div className="field">
          <label>Story</label>
          <textarea rows={6} value={editForm.story} onChange={(e) => setEditForm({ ...editForm, story: e.target.value })} />
        </div>
        <div className="field">
          <label>Link</label>
          <input value={editForm.link} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} />
        </div>
        <div className="field">
          <label>Link title</label>
          <input value={editForm.linkTitle} onChange={(e) => setEditForm({ ...editForm, linkTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Link description</label>
          <textarea value={editForm.linkDescription} onChange={(e) => setEditForm({ ...editForm, linkDescription: e.target.value })} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" type="button" disabled={busyId === id} onClick={() => saveEdit(section, id)}>
            Save
          </button>
          <button className="btn btn-outline" type="button" onClick={cancelEdit}>Cancel</button>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
    return <div className="page"><p className="muted">Loading&hellip;</p></div>
  }

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="label">Admin</p>
          <h1>Manage Tributes</h1>
        </div>
        <Link className="btn btn-outline" href="/admin">Back to Site Text</Link>
      </div>

      {error && <p className="form-note" style={{ color: '#8a2f2f' }}>{error}</p>}

      {/* PENDING */}
      <h2>Pending Approval ({data?.pending?.length || 0})</h2>
      {(!data?.pending || data.pending.length === 0) && (
        <p className="muted">Nothing waiting for review right now.</p>
      )}
      {data?.pending?.map((item) => (
        <div className="form-box" key={item.id} style={{ marginBottom: 16 }}>
          {editingKey === `pending:${item.id}` ? (
            <EditForm section="pending" id={item.id} />
          ) : (
            <>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                {item.name} {item.displayPreference === 'anonymous' ? '(wants to post anonymously)' : ''}
                {item.connection ? ` · ${item.connection}` : ''}
              </p>
              {item.story && <p style={{ whiteSpace: 'pre-wrap' }}>&ldquo;{item.story}&rdquo;</p>}
              {item.link && (
                <p style={{ fontFamily: 'var(--sans)', fontSize: 13 }}>
                  <a href={item.link} target="_blank" rel="noreferrer">{item.linkTitle || item.link}</a>
                  {item.linkDescription && <><br />{item.linkDescription}</>}
                </p>
              )}
              {(item.imageUrls || (item.imageUrl ? [item.imageUrl] : [])).length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {(item.imageUrls || [item.imageUrl]).map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: 120, height: 120, objectFit: 'cover', border: '1px solid var(--border)' }} />
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" type="button" disabled={busyId === item.id} onClick={() => runAction({ action: 'approve', id: item.id })}>
                  Approve
                </button>
                <button className="btn btn-outline" type="button" disabled={busyId === item.id} onClick={() => startEdit('pending', item)}>
                  Edit
                </button>
                <button className="btn btn-outline" type="button" disabled={busyId === item.id} onClick={() => runAction({ action: 'reject', id: item.id })}>
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* APPROVED */}
      <h2>Approved & Live ({data?.approved?.length || 0})</h2>
      {(!data?.approved || data.approved.length === 0) && (
        <p className="muted">Nothing approved yet.</p>
      )}
      {data?.approved?.map((item) => (
        <div className="tribute" key={item.id}>
          {editingKey === `approved:${item.id}` ? (
            <EditForm section="approved" id={item.id} />
          ) : (
            <>
              <p className="who">
                {item.displayPreference === 'anonymous' ? 'A former student' : item.name}
                {item.connection ? `, ${item.connection}` : ''}
              </p>
              {item.story && <p style={{ whiteSpace: 'pre-wrap' }}>&ldquo;{item.story}&rdquo;</p>}
              {item.link && <p style={{ fontFamily: 'var(--sans)', fontSize: 13 }}><a href={item.link} target="_blank" rel="noreferrer">{item.linkTitle || item.link}</a></p>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline" type="button" disabled={busyId === item.id} onClick={() => startEdit('approved', item)}>
                  Edit
                </button>
                <button className="btn btn-outline" type="button" disabled={busyId === item.id} onClick={() => runAction({ action: 'feature-from-approved', id: item.id })}>
                  Feature This
                </button>
                <button className="btn btn-outline" type="button" disabled={busyId === item.id} onClick={() => runAction({ action: 'delete-approved', id: item.id })}>
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* FEATURED */}
      <h2>Featured Content (top of page)</h2>
      {data?.featured?.map((item) => (
        <div className="tribute" key={item.id}>
          <p style={{ fontWeight: 600 }}>{item.title}</p>
          {item.url && <p style={{ fontFamily: 'var(--sans)', fontSize: 13 }}><a href={item.url} target="_blank" rel="noreferrer">{item.url}</a></p>}
          {item.description && <p className="who">{item.description}</p>}
          <button
            className="btn btn-outline"
            type="button"
            disabled={busyId === item.id}
            onClick={() => runAction({ action: 'delete-featured', id: item.id })}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="form-box">
        <p className="form-note" style={{ marginTop: 0, marginBottom: 14 }}>Add featured content</p>
        <div className="field">
          <label htmlFor="ft-title">Title</label>
          <input id="ft-title" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="ft-url">Link (optional)</label>
          <input id="ft-url" value={newItem.url} onChange={(e) => setNewItem({ ...newItem, url: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="ft-desc">Description (optional)</label>
          <textarea id="ft-desc" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="ft-image">Image (optional)</label>
          <input id="ft-image" type="file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files?.[0] || null)} />
        </div>
        <button className="btn btn-primary" type="button" disabled={addingFeatured} onClick={handleAddFeatured}>
          {addingFeatured ? 'Adding…' : 'Add'}
        </button>
      </div>
    </div>
  )
}
