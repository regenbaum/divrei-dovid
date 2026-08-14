// An abstract ink-wash mark, echoing the dense painterly illustration on
// "The Library of Everything" cover — but reduced to a soft, modern gesture
// rather than reproducing it literally. Sits behind the hero text.
export default function InkBlot() {
  return (
    <svg
      className="ink-blot"
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g style={{ mixBlendMode: 'multiply' }}>
        <path
          d="M120 80 C60 120 40 200 90 250 C140 300 220 310 280 270 C310 250 300 200 340 190 C400 175 460 130 430 80 C400 30 320 20 260 40 C210 57 170 50 120 80 Z"
          fill="#6e2a2a"
          opacity="0.10"
        />
        <path
          d="M200 60 C150 90 150 160 200 190 C250 220 330 210 360 170 C385 137 360 95 320 75 C280 55 240 40 200 60 Z"
          fill="#a5813f"
          opacity="0.14"
        />
        <path
          d="M340 140 C310 160 320 210 360 220 C410 232 460 200 450 160 C442 128 375 118 340 140 Z"
          fill="#1e1a16"
          opacity="0.06"
        />
      </g>
    </svg>
  )
}
