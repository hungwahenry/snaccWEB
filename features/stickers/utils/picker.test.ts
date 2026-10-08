import { describe, expect, it } from "vitest"
import type {
  Sticker,
  StickerPack,
  StickerPackDetail,
  StickerTray,
} from "../types"
import { packViewRows, pickerJumps, pickerRows } from "./picker"

const sticker = (id: string): Sticker => ({
  id,
  pack_id: "p",
  source: "upload",
  format: "static",
  url: `${id}.png`,
  preview_url: null,
  width: 512,
  height: 512,
  premium: false,
  held: false,
})

const pack = (
  id: string,
  kind: "favourites" | "pack",
  stickers: Sticker[],
  extra = {}
) =>
  ({
    id,
    kind,
    title: id,
    owner: null,
    mine: kind === "favourites",
    saved: kind === "pack",
    stickers,
    stickers_count: stickers.length,
    ...extra,
  }) as StickerPackDetail

const tray = (packs: StickerPackDetail[] = []): StickerTray => ({
  favourites: pack("fav", "favourites", [sticker("a")]),
  packs,
})

const keys = (rows: { key: string }[]) => rows.map((row) => row.key)

describe("sticker picker", () => {
  it("lists Favourites then each pack with stickers, under their own headers", () => {
    const rows = pickerRows(
      tray([
        pack("one", "pack", [sticker("b"), sticker("c")]),
        pack("empty", "pack", []),
      ]),
      [],
      false
    )

    expect(keys(rows)).toEqual(["section-fav", "a", "section-one", "b", "c"])
  })

  it("keeps an empty Favourites with a hint, so there is somewhere to make one", () => {
    const rows = pickerRows(
      { favourites: pack("fav", "favourites", []), packs: [] },
      [],
      false
    )

    expect(rows.map((row) => row.kind)).toEqual(["section", "hint"])
  })

  it("ends with packs to discover, leaving out ones already in the tray", () => {
    const catalog = [
      pack("one", "pack", [], { saved: true }) as StickerPack,
      pack("fresh", "pack", [], { saved: false }) as StickerPack,
    ]
    const rows = pickerRows(tray(), catalog, false)

    expect(keys(rows).slice(-2)).toEqual(["discover", "pack-fresh"])
  })

  it("jumps to each pack and to Discover", () => {
    const packs = [pack("one", "pack", [sticker("b")])]
    const rows = pickerRows(
      tray(packs),
      [pack("fresh", "pack", [], { saved: false })],
      false
    )
    const jumps = pickerJumps(rows, [tray().favourites, ...packs])

    expect(jumps.map((jump) => jump.key)).toEqual(["fav", "one", "discover"])
  })

  it("shows a pack on its own, offering to add it only when it is someone else's", () => {
    const theirs = pack("fresh", "pack", [sticker("b")], { saved: false })
    const [top] = packViewRows(theirs, false)

    expect(top).toMatchObject({ kind: "top", save: "add" })
    expect(packViewRows({ ...theirs, mine: true }, false)[0]).toMatchObject({
      save: null,
    })
  })
})
