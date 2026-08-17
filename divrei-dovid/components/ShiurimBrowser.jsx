'use client'

import { useMemo, useState } from 'react'
import { normalizeTransliteration } from '@/lib/transliteration'

export default function ShiurimBrowser({ shiurim }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => {
    const set = new Set(shiurim.map((s) => s.category))
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [shiurim])

  const filtered = useMemo(() => {
    let list = shiurim
    if (category !== 'All') {
      list = list.filter((s) => s.category === category)
    }
    if (query.trim()) {
      const q = normalizeTransliteration(query)
      list = list.filter((s) => normalizeTransliteration(s.title).includes(q))
    }
    return list
  }, [shiurim, query, category])

  return (
    <div>
      <div className="filter-row">
        <div className="field" style={{ maxWidth: 420, flex: 1 }}>
          <label htmlFor="search">Search by title</label>
          <input
            id="search"
            type="text"
            placeholder="e.g. teshuva, Shabbos/Shabbat, Chanukah…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="field" style={{ maxWidth: 260 }}>
          <label htmlFor="category">Topic</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="muted" style={{ fontFamily: 'var(--sans)', fontSize: 13, marginTop: 4 }}>
        Showing {filtered.length} of {shiurim.length}
      </p>

      {filtered.length === 0 ? (
        <p className="muted">No shiurim match that search.</p>
      ) : (
        <ul className="resource-list">
          {filtered.map((s) => (
            <li key={s.id}>
              <div className="card-tag">{s.category}</div>
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
