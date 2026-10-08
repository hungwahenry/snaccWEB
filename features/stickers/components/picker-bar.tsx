import { CompassIcon, StickerIcon } from "lucide-react"
import { GiphyAttribution } from "@/features/giphy/components/giphy-attribution"
import { cn } from "@/lib/utils"
import type { PickerJump, PickerTab } from "../types"
import { coverUrlOf } from "../utils/packs"
import { PackCover } from "./pack-cover"

export interface PickerBarProps {
  tabs: readonly PickerTab[] | null
  tab: PickerTab
  onTab: (tab: PickerTab) => void
  jumps: PickerJump[]
  current: string | null
  onJump: (jump: PickerJump) => void
  attribution: boolean
}

export function PickerBar({
  tabs,
  tab,
  onTab,
  jumps,
  current,
  onJump,
  attribution,
}: PickerBarProps) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
      {tabs ? (
        <div
          role="tablist"
          className="flex shrink-0 rounded-full bg-muted p-0.5"
        >
          {tabs.map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={option === tab}
              aria-label={option === "stickers" ? "Stickers" : "GIFs"}
              onClick={() => onTab(option)}
              className={cn(
                "flex h-8 min-w-10 items-center justify-center rounded-full px-2.5 text-xs font-bold transition-colors",
                option === tab
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option === "stickers" ? (
                <StickerIcon className="size-4" aria-hidden />
              ) : (
                "GIF"
              )}
            </button>
          ))}
        </div>
      ) : null}

      {attribution ? (
        <GiphyAttribution className="ml-auto pt-0 text-right" />
      ) : (
        <div className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {jumps.map((jump) => (
            <button
              key={jump.key}
              type="button"
              onClick={() => onJump(jump)}
              aria-label={jump.pack?.title ?? "Discover packs"}
              aria-current={jump.key === current}
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted/60",
                jump.key === current && "bg-muted"
              )}
            >
              {jump.pack ? (
                <PackCover
                  url={coverUrlOf(jump.pack)}
                  className="size-7 rounded-lg"
                />
              ) : (
                <CompassIcon className="size-5 text-foreground" aria-hidden />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
