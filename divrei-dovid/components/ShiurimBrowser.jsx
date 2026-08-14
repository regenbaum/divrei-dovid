'use client'

import { useMemo, useState } from 'react'

export default function ShiurimBrowser({ shiurim }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return shiurim
    const q = query.toLowerCase()
    return shiurim.filter((s) => s.title.toLowerCase().includes(q))
  }, [shiurim, query])

  return (
    <div>
      <div className="field" style={{ maxWidth: 420 }}>
        <label htmlFor="search">Search by title</label>
        <input
          id="search"
          type="text"
          placeholder="e.g. teshuva, Lech Lecha, mussar…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No shiurim match that search.</p>
      ) : (
        <ul className="resource-list">
          {filtered.map((s) => (
            <li key={s.id}>
              <a href={s.viewUrl} target="_blank" rel="noreferrer" className="r-title">
                {s.title}
              </a>
              <div className="r-desc">
                {new Date(s.createdTime).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
