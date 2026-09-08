const CONE = "#FF4D6D"
const CONE_DEEP = "#E02F52"
const STRIPE = "#FFC93C"
const POM = "#3BCEAC"
const POM_DEEP = "#2AA98C"

const W = 64
const H = 72
const RATIO = W / H
const CONE_PATH = "M32 12 L55 57 Q32 67 9 57 Z"

export function PartyHat({ size = 54 }: { size?: number }) {
  return (
    <svg
      width={size * RATIO}
      height={size}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="hat-cone">
          <path d={CONE_PATH} />
        </clipPath>
        <linearGradient id="hat-body" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor={CONE} />
          <stop offset="1" stopColor={CONE_DEEP} />
        </linearGradient>
      </defs>

      <path d={CONE_PATH} fill="url(#hat-body)" />

      <g clipPath="url(#hat-cone)">
        <path d="M-26 76 L20 -4" stroke={STRIPE} strokeWidth="9" fill="none" />
        <path d="M-6 78 L40 -2" stroke={STRIPE} strokeWidth="9" fill="none" />
        <path d="M14 80 L60 0" stroke={STRIPE} strokeWidth="9" fill="none" />
        <path d="M34 82 L80 2" stroke={STRIPE} strokeWidth="9" fill="none" />
        <path d="M32 12 L55 57 Q44 62 32 63 Z" fill="#000" opacity="0.14" />
      </g>

      <ellipse
        cx="32"
        cy="58.5"
        rx="23"
        ry="6"
        fill={CONE_DEEP}
        opacity="0.55"
      />
      <path
        d={CONE_PATH}
        fill="none"
        stroke="#000"
        strokeWidth="0.5"
        opacity="0.08"
      />

      <circle cx="27" cy="12" r="5" fill={POM_DEEP} />
      <circle cx="34" cy="9" r="6" fill={POM} />
      <circle cx="31" cy="7" r="2" fill="#fff" opacity="0.5" />
    </svg>
  )
}
