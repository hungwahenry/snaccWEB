import {
  FilmIcon,
  HeartIcon,
  SearchXIcon,
  StickerIcon,
  WandSparklesIcon,
} from "lucide-react"
import type { PillTab } from "@/components/ui/pill-tabs"
import type { TrayEmpty, TrayTab } from "../types"

const TABS: Record<TrayTab, PillTab<TrayTab>> = {
  stickers: { value: "stickers", label: "Stickers", icon: StickerIcon },
  gifs: { value: "gifs", label: "GIFs", icon: WandSparklesIcon },
  mine: { value: "mine", label: "Mine", icon: HeartIcon },
}

export function trayTabs({
  stickers,
  gifs,
}: {
  stickers: boolean
  gifs: boolean
}): PillTab<TrayTab>[] {
  return [
    ...(stickers ? [TABS.stickers] : []),
    ...(gifs ? [TABS.gifs] : []),
    ...(stickers ? [TABS.mine] : []),
  ]
}

export function trayTitle(tabs: PillTab<TrayTab>[]): string {
  return tabs.some((tab) => tab.value === "stickers") ? "Stickers" : "GIFs"
}

/** The tab to show: the one picked while it's still on offer, else the first there is. */
export function shownTab(
  tabs: PillTab<TrayTab>[],
  picked: TrayTab | null
): TrayTab {
  if (picked && tabs.some((tab) => tab.value === picked)) return picked
  return tabs[0]?.value ?? "gifs"
}

const NOTHING_MATCHED: TrayEmpty = {
  icon: SearchXIcon,
  title: "Nothing matched",
  description: "Try another word.",
}

export function trayEmpty(tab: TrayTab, searching: boolean): TrayEmpty {
  if (tab === "mine") {
    return {
      icon: HeartIcon,
      title: "Nothing saved yet",
      description: "Hold any sticker to keep it here.",
    }
  }
  if (searching) return NOTHING_MATCHED

  return tab === "gifs"
    ? {
        icon: FilmIcon,
        title: "No GIFs right now",
        description: "Check back in a bit.",
      }
    : {
        icon: StickerIcon,
        title: "No stickers right now",
        description: "Check back in a bit.",
      }
}

/** Placeholder for the search box; null where the tab has none. */
export function traySearchPlaceholder(tab: TrayTab): string | null {
  if (tab === "mine") return null
  return tab === "gifs" ? "Search GIFs" : "Search stickers"
}

export function trayItemLabel(tab: TrayTab): string {
  return tab === "gifs" ? "GIF" : "Sticker"
}

/** Deals items across columns left to right, so each column keeps the feed's order. */
export function columnsOf<T>(items: T[], count: number): T[][] {
  const columns: T[][] = Array.from({ length: Math.max(1, count) }, () => [])
  items.forEach((item, index) => columns[index % columns.length].push(item))
  return columns
}
