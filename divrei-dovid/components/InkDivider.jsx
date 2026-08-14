// A hand-drawn-feeling horizontal brushstroke used to separate sections,
// instead of a plain <hr>. Echoes the ink-illustration texture of the
// book cover in a single quiet gesture rather than a straight line.
export default function InkDivider() {
  return (
    <svg
      className="ink-divider"
      viewBox="0 0 1000 46"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M20 24 C 220 8, 380 40, 500 22 C 620 6, 760 38, 980 20"
        fill="none"
        stroke="#a5813f"
        strokeWidth="1.4"
        opacity="0.55"
        strokeLinecap="round"
      />
      <circle cx="500" cy="22" r="3.2" fill="#6e2a2a" opacity="0.7" />
    </svg>
  )
}
