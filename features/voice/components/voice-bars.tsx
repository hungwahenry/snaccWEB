import { cn } from "@/lib/utils"
import { BAR_GAP, BAR_WIDTH, barLit, MIN_BAR_HEIGHT } from "../utils/wave"

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
      aria-hidden
      className="pointer-events-none flex items-center"
      style={{ height, gap: BAR_GAP }}
    >
      {levels.map((level, index) => (
        <span
          key={index}
          className={cn(
            "shrink-0 rounded-full",
            progress === undefined
              ? className
              : cn(activeClassName, "transition-opacity duration-[120ms]")
          )}
          style={{
            width: BAR_WIDTH,
            height: Math.max(MIN_BAR_HEIGHT, level * height),
            opacity:
              progress === undefined
                ? undefined
                : barLit(progress, index, total)
                  ? 1
                  : 0.28,
          }}
        />
      ))}
    </div>
  )
}
