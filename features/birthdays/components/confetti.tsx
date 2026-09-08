"use client"

const COLORS = ["#FF4D6D", "#FFC93C", "#3BCEAC", "#7C5CFF", "#FF8A3D"]
const PIECES = 42

const pieces = Array.from({ length: PIECES }, (_, index) => ({
  left: (index * 97) % 100,
  delay: ((index * 37) % 250) / 100,
  duration: 3 + ((index * 13) % 22) / 10,
  size: 6 + ((index * 7) % 6),
  color: COLORS[index % COLORS.length],
  tilt: ((index * 53) % 90) - 45,
}))

export function Confetti() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
    >
      {pieces.map((piece, index) => (
        <span
          key={index}
          className="absolute top-0 animate-[confetti-fall_linear_infinite]"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.6,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            ["--tilt" as string]: `${piece.tilt}deg`,
          }}
        />
      ))}
    </div>
  )
}
