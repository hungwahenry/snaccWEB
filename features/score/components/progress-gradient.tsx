export function ProgressGradient({
  progress,
  from,
  to,
  height = 10,
}: {
  progress: number
  from: string
  to: string
  height?: number
}) {
  const width = Math.max(0, Math.min(1, progress)) * 100

  return (
    <div
      className="w-full overflow-hidden bg-muted"
      style={{ height, borderRadius: height / 2 }}
    >
      <div
        className="h-full transition-[width] duration-500"
        style={{
          width: `${width}%`,
          borderRadius: height / 2,
          background: `linear-gradient(90deg, ${from || "var(--foreground)"}, ${to || "var(--foreground)"})`,
        }}
      />
    </div>
  )
}
