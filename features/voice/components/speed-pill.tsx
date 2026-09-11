import { cn } from "@/lib/utils"
import { speedLabel } from "../utils/labels"

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
      aria-label={speedLabel(speed)}
      className={cn(
        "min-w-9 rounded-full px-1.5 py-1 text-[11px] font-bold tabular-nums transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-70",
        onDark ? "bg-background/20 text-background" : "bg-muted text-foreground"
      )}
    >
      {speed}x
    </button>
  )
}
