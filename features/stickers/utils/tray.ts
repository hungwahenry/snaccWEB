import {
  FilmIcon,
  SearchXIcon,
  SmilePlusIcon,
  StickerIcon,
  WandSparklesIcon,
} from "lucide-react"
import type { PillTab } from "@/components/ui/pill-tabs"
import type { TrayEmpty, TrayTab } from "../types"

const TABS: Record<TrayTab, PillTab<TrayTab>> = {
  stickers: { value: "stickers", label: "Stickers", icon: StickerIcon },
  giphy: { value: "giphy", label: "Giphy", icon: SmilePlusIcon },
  gifs: { value: "gifs", label: "GIFs", icon: WandSparklesIcon },
}

export function trayTabs({
  stickers,
  gifs,
}: {
  stickers: boolean
  gifs: boolean
}): PillTab<TrayTab>[] {
  return [
    ...(stickers ? [TABS.stickers, TABS.giphy] : []),
    ...(gifs ? [TABS.gifs] : []),
  ]
}

export function trayTitle(tabs: PillTab<TrayTab>[]): string {
  return tabs.some((tab) => tab.value === "stickers") ? "Stickers" : "GIFs"
}

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

export function giphyEmpty(tab: TrayTab, searching: boolean): TrayEmpty {
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

export function traySearchPlaceholder(tab: TrayTab): string | null {
  if (tab === "stickers") return null
  return tab === "gifs" ? "Search GIFs" : "Search Giphy stickers"
}

export function trayItemLabel(tab: TrayTab): string {
  return tab === "gifs" ? "GIF" : "Sticker"
}

export function columnsOf<T>(items: T[], count: number): T[][] {
  const columns: T[][] = Array.from({ length: Math.max(1, count) }, () => [])
  items.forEach((item, index) => columns[index % columns.length].push(item))
  return columns
}
