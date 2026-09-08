import { PauseIcon, PlayIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function PlayerButton({
  playing,
  loading = false,
  onDark,
  onPress,
}: {
  playing: boolean
  loading?: boolean
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
      aria-label={
        loading
          ? "Loading voice note"
          : playing
            ? "Pause voice note"
            : "Play voice note"
      }
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full transition-opacity active:opacity-70",
        onDark ? "bg-background/20 text-background" : "bg-muted text-foreground"
      )}
    >
      {loading ? (
        <Spinner className="size-4" />
      ) : playing ? (
        <PauseIcon className="size-4" />
      ) : (
        <PlayIcon className="size-4" />
      )}
    </button>
  )
}
