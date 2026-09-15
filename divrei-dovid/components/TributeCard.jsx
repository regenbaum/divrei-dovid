'use client'

import { useState } from 'react'

// Enough text to reliably exceed 3 rendered lines on most screen widths —
// a rough heuristic rather than exact DOM measurement, so the Show More
// button only appears when it's actually needed.
const CLAMP_THRESHOLD = 220

// Supports both the new "imageUrls" array and older single-"imageUrl"
// entries, so nothing already saved ever breaks when this shape changes.
function imagesOf(item) {
  if (Array.isArray(item.imageUrls) && item.imageUrls.length > 0) return item.imageUrls
  if (item.imageUrl) return [item.imageUrl]
  return []
}

export default function TributeCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  const images = imagesOf(item)
  const needsClamp = item.story && item.story.length > CLAMP_THRESHOLD

  return (
    <div className="tribute">
      {images.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{ width: 160, height: 160, objectFit: 'cover', border: '1px solid var(--border)' }}
            />
          ))}
        </div>
      )}

      {item.story && (
        <>
          {/* white-space: pre-wrap (in .tribute-story) preserves whatever
              paragraph breaks, indentation, and numbering the person
              typed — without ever rendering their text as HTML. */}
          <p className={`tribute-story${!expanded && needsClamp ? ' clamped' : ''}`}>
            &ldquo;{item.story}&rdquo;
          </p>
          {needsClamp && (
            <button type="button" className="show-more-btn" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </>
      )}

      {item.link && (
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14 }}>
          <a href={item.link} target="_blank" rel="noreferrer">{item.linkTitle || item.link}</a>
          {item.linkDescription && <><br />{item.linkDescription}</>}
        </p>
      )}

      <p className="who">
        &mdash; {item.displayPreference === 'anonymous' ? 'A former student' : item.name}
        {item.connection ? `, ${item.connection}` : ''}
      </p>
    </div>
  )
}
