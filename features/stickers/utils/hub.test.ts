import { describe, expect, it } from "vitest"
import type { StickerPack } from "../types"
import { hubRows } from "./hub"

const pack = (id: string, extra: Partial<StickerPack> = {}) =>
  ({ id, kind: "pack", mine: false, saved: false, ...extra }) as StickerPack

describe("stickers screen", () => {
  it("lists your stickers, your tray and new packs once each", () => {
    const rows = hubRows({
      favourites: pack("fav", { kind: "favourites", mine: true }),
      mine: [pack("made", { mine: true, saved: true })],
      tray: [
        pack("made", { mine: true, saved: true }),
        pack("saved", { saved: true }),
      ],
      catalog: [pack("saved", { saved: true }), pack("fresh")],
    })

    expect(rows.map((row) => row.key)).toEqual([
      "section-yours",
      "yours-fav",
      "yours-made",
      "new-pack",
      "section-tray",
      "tray-saved",
      "section-discover",
      "discover-fresh",
    ])
  })

  it("offers removing what is in your tray and adding what is not", () => {
    const rows = hubRows({
      favourites: null,
      mine: [],
      tray: [pack("saved", { saved: true })],
      catalog: [pack("fresh")],
    })
    const actions = rows.flatMap((row) =>
      row.kind === "pack" ? [row.action?.label] : []
    )

    expect(actions).toEqual(["Remove", "Add"])
  })

  it("leaves out sections with nothing in them", () => {
    const rows = hubRows({ favourites: null, mine: [], tray: [], catalog: [] })

    expect(rows.map((row) => row.kind)).toEqual(["section", "new"])
  })
})
