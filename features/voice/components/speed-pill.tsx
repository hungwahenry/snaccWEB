import { cn } from "@/lib/utils"

export function SpeedPill({
  speed,
  onDark,
  onPress,
}: {
  speed: number
  onDark: boolean
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onPress()
      }}
      aria-label={`Playback speed ${speed}x, tap to change`}
      className={cn(
        "min-w-9 rounded-full px-1.5 py-1 text-[11px] font-bold tabular-nums transition-opacity active:opacity-70",
        onDark ? "bg-background/20 text-background" : "bg-muted text-foreground"
      )}
    >
      {speed}x
    </button>
  )
}
