import { useId } from "react"
import { cn } from "@/lib/utils"
import { sparklinePaths } from "../utils/sparkline"

const TONE_CLASS = {
  up: "text-success",
  down: "text-destructive",
  flat: "text-muted-foreground",
} as const

export function Sparkline({
  values,
  tone,
  width = 96,
  height = 36,
  className,
}: {
  values: number[]
  tone: keyof typeof TONE_CLASS
  width?: number
  height?: number
  className?: string
}) {
  const gradientId = useId()
  const paths = sparklinePaths(values, width, height)
  if (!paths) return null

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("block", TONE_CLASS[tone], className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity={0.28} />
          <stop offset="1" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={paths.area} fill={`url(#${gradientId})`} />
      <path
        d={paths.line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
