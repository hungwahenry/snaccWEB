import { progressPercent, ringOffset } from "@/lib/progress"
import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

const SIZES = {
  sm: { box: 32, stroke: 3, text: "text-[9px]", spinner: "size-3" },
  md: { box: 48, stroke: 4, text: "text-xs", spinner: "size-4" },
  lg: { box: 72, stroke: 5, text: "text-base", spinner: "size-6" },
} as const

type ProgressRingProps = {
  progress: number | null
  size?: keyof typeof SIZES
  tone?: "media" | "default"
  label?: string
  className?: string
}

export function ProgressRing({
  progress,
  size = "md",
  tone = "media",
  label = "Loading",
  className,
}: ProgressRingProps) {
  const { box, stroke, text, spinner } = SIZES[size]
  const center = box / 2
  const radius = (box - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const onMedia = tone === "media"
  const percent = progress === null ? null : progressPercent(progress)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent ?? undefined}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        onMedia ? "bg-black/45 text-white" : "text-foreground",
        className
      )}
      style={{ width: box, height: box }}
    >
      <svg
        width={box}
        height={box}
        aria-hidden
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={onMedia ? "stroke-white/25" : "stroke-muted"}
        />
        {progress === null ? null : (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={ringOffset(progress, circumference)}
            className="stroke-current transition-[stroke-dashoffset] duration-300 motion-reduce:transition-none"
          />
        )}
      </svg>

      {percent === null ? (
        <Spinner className={spinner} />
      ) : (
        <span className={cn("font-bold tabular-nums", text)}>{percent}%</span>
      )}
    </div>
  )
}
