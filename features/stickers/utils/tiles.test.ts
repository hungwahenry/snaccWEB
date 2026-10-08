import { describe, expect, it } from "vitest"
import type { Sticker, StickerPackDetail } from "../types"
import { packTiles, placeOf, tileActions } from "./tiles"

const sticker = (id: string, extra: Partial<Sticker> = {}): Sticker => ({
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
  ...extra,
})

const ids = (actions: { id: string }[]) => actions.map((action) => action.id)

describe("sticker tiles", () => {
  it("knows where a sticker lives", () => {
    expect(placeOf({ kind: "favourites", mine: true })).toBe("favourites")
    expect(placeOf({ kind: "pack", mine: true })).toBe("own")
    expect(placeOf({ kind: "pack", mine: false })).toBe("others")
  })

  it("marks each sticker ready, locked or held for this person", () => {
    const pack = {
      kind: "pack",
      mine: false,
      stickers: [sticker("a"), sticker("b", { premium: true })],
    } as StickerPackDetail

    expect(packTiles(pack, false).map((tile) => tile.state)).toEqual([
      "ready",
      "locked",
    ])
  })

  it("offers only what makes sense where the sticker lives", () => {
    expect(ids(tileActions("favourites", "ready"))).toEqual(["unfavourite"])
    expect(ids(tileActions("own", "ready"))).toEqual(["favourite", "remove"])
    expect(ids(tileActions("own", "held"))).toEqual(["remove"])
    expect(ids(tileActions("others", "locked"))).toEqual(["favourite"])
  })
})
