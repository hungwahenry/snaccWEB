import { cn } from "@/lib/utils"

const BAR_WIDTH = 3
const GAP = 3
const MIN_HEIGHT = 3

export function barCount(width: number): number {
  return Math.max(1, Math.floor((width + GAP) / (BAR_WIDTH + GAP)))
}

export function VoiceBars({
  levels,
  height,
  progress,
  className = "bg-muted-foreground",
  activeClassName = "bg-primary",
}: {
  levels: number[]
  height: number
  progress?: number
  className?: string
  activeClassName?: string
}) {
  const total = levels.length

  return (
    <div
      className="pointer-events-none flex items-center"
      style={{ height, gap: GAP }}
    >
      {levels.map((level, index) => (
        <span
          key={index}
          className={cn(
            "rounded-full",
            progress === undefined
              ? className
              : cn(activeClassName, "transition-opacity duration-[120ms]")
          )}
          style={{
            width: BAR_WIDTH,
            height: Math.max(MIN_HEIGHT, level * height),
            opacity:
              progress === undefined
                ? undefined
                : progress * total >= index + 1
                  ? 1
                  : 0.28,
          }}
        />
      ))}
    </div>
  )
}
