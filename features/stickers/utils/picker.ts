import type { Gif } from "@/features/giphy/types"
import type {
  PackSave,
  PickerJump,
  PickerRow,
  StickerPack,
  StickerPackDetail,
  StickerTray,
} from "../types"
import { packByline, packDetails } from "./packs"
import { packTiles, placeOf } from "./tiles"

const DISCOVER_KEY = "discover"

function saveOf(pack: StickerPack): PackSave | null {
  if (placeOf(pack) !== "others") return null
  return pack.saved ? "remove" : "add"
}

export function trayPacks(tray: StickerTray | undefined): StickerPackDetail[] {
  return tray ? [tray.favourites, ...tray.packs] : []
}

export function pickerRows(
  tray: StickerTray,
  catalog: StickerPack[],
  premium: boolean
): PickerRow[] {
  const sections = trayPacks(tray).flatMap((pack): PickerRow[] => {
    const favourites = pack.kind === "favourites"
    const section: PickerRow = {
      kind: "section",
      key: `section-${pack.id}`,
      packId: pack.id,
      title: pack.title,
      byline: packByline(pack),
      makes: favourites,
      opens: !favourites,
    }
    const tiles = packTiles(pack, premium).map((tile): PickerRow => ({
      kind: "tile",
      key: tile.sticker.id,
      tile,
    }))

    if (tiles.length > 0) return [section, ...tiles]
    return favourites ? [section, { kind: "hint", key: `hint-${pack.id}` }] : []
  })

  const discover = catalog.filter((pack) => !pack.saved && !pack.mine)
  if (discover.length === 0) return sections

  return [
    ...sections,
    { kind: "discover", key: DISCOVER_KEY },
    ...discover.map((pack): PickerRow => ({
      kind: "pack",
      key: `pack-${pack.id}`,
      pack,
      details: packDetails(pack),
    })),
  ]
}

export function packViewRows(
  pack: StickerPackDetail,
  premium: boolean
): PickerRow[] {
  return [
    {
      kind: "top",
      key: `top-${pack.id}`,
      pack,
      details: packDetails(pack),
      save: saveOf(pack),
    },
    ...packTiles(pack, premium).map((tile): PickerRow => ({
      kind: "tile",
      key: tile.sticker.id,
      tile,
    })),
  ]
}

export function giphyRows(gifs: Gif[]): PickerRow[] {
  return gifs.map((gif) => ({ kind: "giphy", key: `giphy-${gif.id}`, gif }))
}

export function pickerJumps(
  rows: PickerRow[],
  packs: StickerPackDetail[]
): PickerJump[] {
  return rows.flatMap((row): PickerJump[] => {
    if (row.kind === "discover") return [{ key: DISCOVER_KEY, pack: null }]
    if (row.kind !== "section") return []
    const pack = packs.find((candidate) => candidate.id === row.packId)
    return pack ? [{ key: pack.id, pack }] : []
  })
}

export function jumpSelector(jump: PickerJump): string {
  const row = jump.pack ? `section-${jump.pack.id}` : DISCOVER_KEY
  return `[data-row="${row}"]`
}

export function isFullWidth(row: PickerRow): boolean {
  return row.kind !== "tile" && row.kind !== "giphy"
}
