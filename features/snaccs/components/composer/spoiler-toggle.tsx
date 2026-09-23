import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function SpoilerToggle({
  spoiler,
  onToggle,
}: {
  spoiler: boolean
  onToggle: () => void
}) {
  const Icon = spoiler ? EyeOffIcon : EyeIcon

  return (
    <button
      type="button"
      role="switch"
      aria-checked={spoiler}
      aria-label={
        spoiler ? "Uncover this media" : "Cover this media as sensitive"
      }
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-bold transition-colors active:opacity-70",
        spoiler
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:bg-accent"
      )}
    >
      <Icon className="size-4" />
      {spoiler ? "Marked sensitive" : "Mark sensitive"}
    </button>
  )
}
