import type { HubAction, HubRow, StickerPack } from "../types"
import { packDetails } from "./packs"

interface HubData {
  favourites: StickerPack | null
  mine: StickerPack[]
  tray: StickerPack[]
  catalog: StickerPack[]
}

const ADD: HubAction = { label: "Add", outline: false }
const REMOVE: HubAction = { label: "Remove", outline: true }

function section(key: string, title: string, rows: HubRow[]): HubRow[] {
  return rows.length > 0 ? [{ kind: "section", key, title }, ...rows] : []
}

function packRows(
  prefix: string,
  packs: StickerPack[],
  action: HubAction | null
): HubRow[] {
  return packs.map((pack) => ({
    kind: "pack",
    key: `${prefix}-${pack.id}`,
    pack,
    details: packDetails(pack),
    action,
  }))
}

export function hubRows({
  favourites,
  mine,
  tray,
  catalog,
}: HubData): HubRow[] {
  return [
    { kind: "section", key: "section-yours", title: "Your stickers" },
    ...packRows("yours", favourites ? [favourites, ...mine] : mine, null),
    { kind: "new", key: "new-pack" },
    ...section(
      "section-tray",
      "In your tray",
      packRows(
        "tray",
        tray.filter((pack) => !pack.mine),
        REMOVE
      )
    ),
    ...section(
      "section-discover",
      "Discover",
      packRows(
        "discover",
        catalog.filter((pack) => !pack.saved && !pack.mine),
        ADD
      )
    ),
  ]
}
