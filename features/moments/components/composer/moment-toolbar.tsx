import { ImageIcon, TypeIcon } from "lucide-react"
import type { ReactNode } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"
import type { MomentMode } from "../../types"

type MomentToolbarProps = {
  mode: MomentMode
  onModeChange: (mode: MomentMode) => void
  remaining: number
  showCounter: boolean
  right?: ReactNode
}

export function MomentToolbar({
  mode,
  onModeChange,
  remaining,
  showCounter,
  right,
}: MomentToolbarProps) {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-1">
        <IconButton
          icon={TypeIcon}
          label="Write a moment"
          aria-pressed={mode === "text"}
          onClick={() => onModeChange("text")}
          iconClassName={cn(mode === "text" && "text-primary")}
        />
        <IconButton
          icon={ImageIcon}
          label="Share a photo"
          aria-pressed={mode === "image"}
          onClick={() => onModeChange("image")}
          iconClassName={cn(mode === "image" && "text-primary")}
        />
      </div>

      <div className="flex items-center gap-3 pr-2">
        {showCounter ? (
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              remaining < 0 ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {remaining}
          </span>
        ) : null}
        {right}
      </div>
    </div>
  )
}
