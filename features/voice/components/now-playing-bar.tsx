import { XIcon } from "lucide-react"
import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { IconButton } from "@/components/ui/icon-button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { PlayerButton } from "./player-button"
import { SpeedPill } from "./speed-pill"

type NowPlayingBarProps = {
  open: boolean
  label: string
  avatarUrl: string | null
  time: string
  progress: number
  playing: boolean
  loading: boolean
  speed: number
  onOpen: () => void
  onToggle: () => void
  onCycleSpeed: () => void
  onStop: () => void
}

export function NowPlayingBar({
  open,
  label,
  avatarUrl,
  time,
  progress,
  playing,
  loading,
  speed,
  onOpen,
  onToggle,
  onCycleSpeed,
  onStop,
}: NowPlayingBarProps) {
  return (
    <div
      data-now-playing={open ? "open" : "closed"}
      inert={!open}
      className="sticky top-0 z-40 flex h-(--now-playing-height) flex-col justify-end overflow-hidden"
    >
      <div
        onClick={onOpen}
        className="relative flex h-(--now-playing-bar) shrink-0 cursor-pointer items-center gap-2 bg-background/95 pr-2 pl-3 backdrop-blur"
      >
        <button
          type="button"
          aria-label={`Open voice note from ${label}`}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {avatarUrl ? (
            <UserAvatar
              avatarUrl={avatarUrl}
              alt=""
              className="size-8"
              textClassName="text-xs"
            />
          ) : (
            <GhostAvatar className="size-8" iconClassName="size-4" />
          )}
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold text-foreground">
              {label}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {time}
            </span>
          </span>
        </button>
        {playing ? (
          <SpeedPill speed={speed} onDark={false} onPress={onCycleSpeed} />
        ) : null}
        <PlayerButton
          playing={playing}
          loading={loading}
          onDark={false}
          onPress={onToggle}
        />
        <IconButton
          icon={XIcon}
          label="Stop voice note"
          onClick={(event) => {
            event.stopPropagation()
            onStop()
          }}
          className="text-muted-foreground hover:text-foreground"
          iconClassName="size-5"
        />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-0.5 bg-border"
        >
          <span
            className="block h-full bg-primary"
            style={{ width: `${progress * 100}%` }}
          />
        </span>
      </div>
    </div>
  )
}
