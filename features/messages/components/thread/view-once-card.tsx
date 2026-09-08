import { EyeIcon, EyeOffIcon, FlameIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { MessageImage } from "../../types"

export function ViewOnceCard({
  photo,
  mine,
  opening,
  onPress,
}: {
  photo: MessageImage
  mine: boolean
  opening: boolean
  onPress: () => void
}) {
  const gone = photo.opened || !photo.available
  const label = gone ? "Photo opened" : mine ? "Photo sent" : "Tap to view once"
  const hint = gone
    ? mine
      ? "They have seen it"
      : "It is gone now"
    : "Seen once, then deleted"
  const strong = mine ? "text-primary-foreground" : "text-foreground"
  const soft = mine ? "text-primary-foreground/60" : "text-muted-foreground"
  const Icon = gone ? EyeOffIcon : mine ? FlameIcon : EyeIcon

  return (
    <button
      type="button"
      disabled={gone || mine || opening}
      onClick={onPress}
      className="flex w-56 items-center gap-2.5 px-3.5 py-3 text-left transition-opacity active:opacity-70 disabled:cursor-default"
    >
      {opening ? (
        <Spinner className={soft} />
      ) : (
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            gone
              ? mine
                ? "bg-background/15"
                : "bg-foreground/10"
              : mine
                ? "bg-background"
                : "bg-primary"
          )}
        >
          <Icon
            className={cn(
              "size-4",
              gone ? soft : mine ? "text-foreground" : "text-primary-foreground"
            )}
          />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm font-bold", gone ? soft : strong)}>
          {label}
        </span>
        <span className={cn("block text-xs", soft)}>{hint}</span>
      </span>
    </button>
  )
}
