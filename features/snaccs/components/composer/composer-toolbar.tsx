import {
  ChartBarBigIcon,
  EyeOffIcon,
  ImageIcon,
  MicIcon,
  StickerIcon,
} from "lucide-react"
import type { ReactNode } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

type ComposerToolbarProps = {
  canAddImages: boolean
  onAddImages: () => void
  showTray?: boolean
  canOpenTray?: boolean
  onOpenTray?: () => void
  showVoice?: boolean
  canRecordVoice?: boolean
  onRecordVoice?: () => void
  showPoll: boolean
  pollActive: boolean
  canStartPoll: boolean
  onTogglePoll: () => void
  showSpoiler: boolean
  spoiler: boolean
  onToggleSpoiler: () => void
  remaining: number
  showCounter: boolean
  right: ReactNode
}

export function ComposerToolbar({
  canAddImages,
  onAddImages,
  showTray = false,
  canOpenTray = false,
  onOpenTray,
  showVoice = false,
  canRecordVoice = false,
  onRecordVoice,
  showPoll,
  pollActive,
  canStartPoll,
  onTogglePoll,
  showSpoiler,
  spoiler,
  onToggleSpoiler,
  remaining,
  showCounter,
  right,
}: ComposerToolbarProps) {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-1">
        <IconButton
          icon={ImageIcon}
          label="Add photos"
          disabled={!canAddImages}
          onClick={onAddImages}
        />
        {showVoice ? (
          <IconButton
            icon={MicIcon}
            label="Record a voice note"
            disabled={!canRecordVoice}
            onClick={onRecordVoice}
          />
        ) : null}
        {showTray ? (
          <IconButton
            icon={StickerIcon}
            label="Add a sticker or GIF"
            disabled={!canOpenTray}
            onClick={onOpenTray}
          />
        ) : null}
        {showPoll ? (
          <IconButton
            icon={ChartBarBigIcon}
            label={pollActive ? "Remove poll" : "Add a poll"}
            disabled={!pollActive && !canStartPoll}
            onClick={onTogglePoll}
            iconClassName={cn(pollActive && "text-success")}
          />
        ) : null}
        {showSpoiler ? (
          <IconButton
            icon={EyeOffIcon}
            label={spoiler ? "Unmark as sensitive" : "Mark as sensitive"}
            onClick={onToggleSpoiler}
            iconClassName={cn(spoiler && "text-success")}
          />
        ) : null}
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
