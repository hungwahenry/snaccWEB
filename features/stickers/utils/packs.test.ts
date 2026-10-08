import { describe, expect, it } from "vitest"
import type { Author } from "@/features/users/types"
import type { Sticker, StickerPack, StickerPackDetail } from "../types"
import {
  canEditPack,
  canSavePack,
  coverUrlOf,
  packByline,
  packEmpty,
  packMenu,
  packSummary,
  packTiles,
  packTitleReady,
  shelfPacks,
  shownPackId,
  tileAction,
  tileState,
  trayPack,
} from "./packs"

const bola = { id: "u1", username: "bola", display_name: "Bola" } as Author

const sticker = (over: Partial<Sticker> = {}): Sticker => ({
  id: "s1",
  pack_id: "p1",
  source: "upload",
  format: "static",
  url: "https://media.test/s1.png",
  preview_url: null,
  width: 512,
  height: 512,
  premium: false,
  held: false,
  ...over,
})

const pack = (over: Partial<StickerPack> = {}): StickerPack => ({
  id: "p1",
  kind: "pack",
  title: "Exam season",
  owner: bola,
  status: "published",
  premium: false,
  cover: null,
  stickers_count: 0,
  mine: false,
  saved: false,
  ...over,
})

const favourites = pack({
  id: "fav",
  kind: "favourites",
  title: "Favourites",
  mine: true,
})

describe("packByline", () => {
  it("names whoever made the pack, or Snacc", () => {
    expect(packByline(pack())).toBe("by @bola")
    expect(packByline(pack({ owner: null }))).toBe("by Snacc")
    expect(packByline(favourites)).toBeNull()
  })
})

describe("packSummary", () => {
  it("says who made it and how many stickers it holds", () => {
    expect(packSummary(pack({ stickers_count: 12 }))).toBe(
      "by @bola · 12 stickers"
    )
    expect(packSummary({ ...favourites, stickers_count: 1 })).toBe("1 sticker")
  })
})

describe("coverUrlOf", () => {
  it("prefers the small preview of the cover", () => {
    expect(
      coverUrlOf(pack({ cover: sticker({ preview_url: "small.png" }) }))
    ).toBe("small.png")
    expect(coverUrlOf(pack({ cover: sticker() }))).toBe(
      "https://media.test/s1.png"
    )
    expect(coverUrlOf(pack())).toBeNull()
  })
})

describe("canEditPack", () => {
  it("lets you change your Favourites and your own live packs", () => {
    expect(canEditPack(favourites)).toBe(true)
    expect(canEditPack(pack({ mine: true }))).toBe(true)
    expect(canEditPack(pack())).toBe(false)
    expect(canEditPack(pack({ mine: true, status: "taken_down" }))).toBe(false)
  })
})

describe("tileState", () => {
  it("holds back a sticker under review, then a Premium one without Premium", () => {
    expect(tileState(sticker({ held: true, premium: true }), false)).toBe(
      "held"
    )
    expect(tileState(sticker({ premium: true }), false)).toBe("locked")
    expect(tileState(sticker({ premium: true }), true)).toBe("ready")
    expect(tileState(sticker(), false)).toBe("ready")
  })
})

describe("tileAction", () => {
  it("removes from packs you can change, else offers to keep what you can send", () => {
    expect(tileAction(favourites, "locked")).toBe("remove")
    expect(tileAction(pack({ mine: true }), "held")).toBe("remove")
    expect(tileAction(pack(), "ready")).toBe("keep")
    expect(tileAction(pack(), "locked")).toBeNull()
  })
})

describe("packTiles", () => {
  it("pairs every sticker with what it shows and what it offers", () => {
    const detail: StickerPackDetail = {
      ...pack({ premium: true }),
      stickers: [sticker({ premium: true }), sticker({ id: "s2" })],
    }

    expect(
      packTiles(detail, false).map((tile) => [tile.state, tile.action])
    ).toEqual([
      ["locked", null],
      ["ready", "keep"],
    ])
  })
})

describe("the tray shelf", () => {
  const tray = {
    favourites,
    packs: [
      pack({ id: "p1", cover: sticker({ preview_url: "small.png" }) }),
      pack({ id: "p2", cover: sticker() }),
    ],
  }

  it("puts Favourites first, then the packs with their covers", () => {
    expect(shelfPacks(tray)).toEqual([
      { id: "fav", title: "Favourites", coverUrl: null, favourites: true },
      {
        id: "p1",
        title: "Exam season",
        coverUrl: "small.png",
        favourites: false,
      },
      {
        id: "p2",
        title: "Exam season",
        coverUrl: "https://media.test/s1.png",
        favourites: false,
      },
    ])
  })

  it("opens on the picked pack while it's still in the tray", () => {
    expect(shownPackId(tray, "p2")).toBe("p2")
    expect(shownPackId(tray, "gone")).toBe("p1")
  })

  it("opens on Favourites once it has something in it", () => {
    expect(
      shownPackId(
        { ...tray, favourites: { ...favourites, stickers_count: 2 } },
        null
      )
    ).toBe("fav")
  })

  it("finds a pack anywhere in the tray", () => {
    expect(trayPack(tray, "fav")?.title).toBe("Favourites")
    expect(trayPack(tray, "p2")?.id).toBe("p2")
    expect(trayPack(tray, null)).toBeUndefined()
    expect(trayPack(undefined, "p1")).toBeUndefined()
  })

  it("falls back to Favourites when the tray has no packs", () => {
    expect(shownPackId({ favourites, packs: [] }, null)).toBe("fav")
    expect(shownPackId(undefined, "p1")).toBeNull()
  })
})

describe("packEmpty", () => {
  it("says how to fill the pack you're looking at", () => {
    expect(packEmpty(favourites).title).toBe("No favourites yet")
    expect(packEmpty(pack({ mine: true })).description).toBe(
      "Create a sticker to start it off."
    )
    expect(packEmpty(pack()).title).toBe("Nothing here yet")
  })
})

describe("packMenu", () => {
  it("offers sharing and reporting on someone else's pack", () => {
    expect(packMenu(pack())).toEqual({
      share: true,
      report: true,
      rename: false,
      remove: false,
    })
  })

  it("offers renaming and deleting on your own pack, never reporting", () => {
    expect(packMenu(pack({ mine: true }))).toEqual({
      share: true,
      report: false,
      rename: true,
      remove: true,
    })
  })

  it("only lets you delete a pack that was taken down", () => {
    expect(packMenu(pack({ mine: true, status: "taken_down" }))).toEqual({
      share: false,
      report: false,
      rename: false,
      remove: true,
    })
  })

  it("offers nothing on your Favourites", () => {
    expect(packMenu(favourites)).toEqual({
      share: false,
      report: false,
      rename: false,
      remove: false,
    })
  })
})

describe("canSavePack", () => {
  it("adds only live packs to the tray", () => {
    expect(canSavePack(pack())).toBe(true)
    expect(canSavePack(pack({ status: "taken_down" }))).toBe(false)
    expect(canSavePack(favourites)).toBe(false)
  })
})

describe("packTitleReady", () => {
  it("needs some words, and not too many", () => {
    expect(packTitleReady("  Exam season ")).toBe(true)
    expect(packTitleReady("   ")).toBe(false)
    expect(packTitleReady("x".repeat(61))).toBe(false)
  })
})
