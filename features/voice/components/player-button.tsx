import { PauseIcon, PlayIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { playButtonLabel } from "../utils/labels"

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
      aria-label={playButtonLabel({ loading, playing })}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-70",
        onDark ? "bg-background/20 text-background" : "bg-muted text-foreground"
      )}
    >
      {loading ? (
        <Spinner className="size-4" aria-hidden />
      ) : playing ? (
        <PauseIcon className="size-4" aria-hidden />
      ) : (
        <PlayIcon className="size-4" aria-hidden />
      )}
    </button>
  )
}
