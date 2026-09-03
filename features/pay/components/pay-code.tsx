import { finderOrigins, inFinder, payCodeMatrix } from "../pay-code"

const INK = "#000000"
const PAPER = "#ffffff"
const HOLE = 0.17
const AVATAR = 0.26
const DOT = 0.52

export function PayCode({
  value,
  size = 220,
  avatarUrl,
}: {
  value: string
  size?: number
  avatarUrl?: string | null
}) {
  const matrix = payCodeMatrix(value)
  const cell = size / matrix.size
  const center = size / 2
  const hole = size * HOLE
  const avatar = size * AVATAR

  const dots: { x: number; y: number }[] = []
  for (let row = 0; row < matrix.size; row += 1) {
    for (let col = 0; col < matrix.size; col += 1) {
      if (!matrix.dark(row, col) || inFinder(row, col, matrix.size)) continue
      const x = (col + 0.5) * cell
      const y = (row + 0.5) * cell
      if (Math.hypot(x - center, y - center) < hole) continue
      dots.push({ x, y })
    }
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <rect width={size} height={size} fill={PAPER} rx={16} />
        {dots.map((dot) => (
          <circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x}
            cy={dot.y}
            r={cell * DOT}
            fill={INK}
          />
        ))}
        {finderOrigins(matrix.size).map(([row, col]) => (
          <Finder key={`${row}-${col}`} x={col * cell} y={row * cell} cell={cell} />
        ))}
      </svg>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: avatar, height: avatar, border: `4px solid ${PAPER}` }}
        />
      ) : null}
    </div>
  )
}

function Finder({ x, y, cell }: { x: number; y: number; cell: number }) {
  return (
    <>
      <rect
        x={x + cell / 2}
        y={y + cell / 2}
        width={cell * 6}
        height={cell * 6}
        rx={cell * 2}
        fill="none"
        stroke={INK}
        strokeWidth={cell}
      />
      <rect
        x={x + cell * 2}
        y={y + cell * 2}
        width={cell * 3}
        height={cell * 3}
        rx={cell * 0.9}
        fill={INK}
      />
    </>
  )
}
