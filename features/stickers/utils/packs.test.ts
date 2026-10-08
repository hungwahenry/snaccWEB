import { describe, expect, it } from "vitest"
import type { Author } from "@/features/users/types"
import {
  canAddTo,
  packByline,
  packDetails,
  packMenu,
  packTitleReady,
  stickerState,
} from "./packs"

const ada = { username: "ada", display_name: "Ada" } as Author

describe("sticker packs", () => {
  it("locks Premium stickers for everyone else, and holds ones under review", () => {
    expect(stickerState({ premium: true, held: false }, false)).toBe("locked")
    expect(stickerState({ premium: true, held: false }, true)).toBe("ready")
    expect(stickerState({ premium: false, held: true }, true)).toBe("held")
  })

  it("credits Snacc, a person, or nobody for Favourites", () => {
    expect(packByline({ kind: "pack", owner: null })).toBe("by Snacc")
    expect(packByline({ kind: "pack", owner: ada })).toBe("by @ada")
    expect(packByline({ kind: "favourites", owner: ada })).toBeNull()
  })

  it("lets people add only to their own packs that are out", () => {
    expect(canAddTo({ mine: true, status: "published" })).toBe(true)
    expect(canAddTo({ mine: true, status: "taken_down" })).toBe(false)
    expect(canAddTo({ mine: false, status: "published" })).toBe(false)
  })

  it("sums a pack up in one line", () => {
    expect(packDetails({ kind: "pack", owner: null, stickers_count: 12 })).toBe(
      "by Snacc · 12 stickers"
    )
    expect(
      packDetails({ kind: "favourites", owner: null, stickers_count: 1 })
    ).toBe("1 sticker")
  })

  it("offers sharing and reporting on other people's packs", () => {
    const ids = packMenu(
      { kind: "pack", mine: false, status: "published" },
      true
    ).map((item) => item.id)
    expect(ids).toEqual(["share", "copy", "report"])
  })

  it("lets an owner rename and delete, and only shares a live pack", () => {
    const live = packMenu(
      { kind: "pack", mine: true, status: "published" },
      true
    )
    const down = packMenu(
      { kind: "pack", mine: true, status: "taken_down" },
      true
    )
    expect(live.map((item) => item.id)).toEqual([
      "share",
      "copy",
      "rename",
      "delete",
    ])
    expect(down.map((item) => item.id)).toEqual(["rename", "delete"])
  })

  it("keeps renaming and deleting to the pack page", () => {
    const ids = packMenu(
      { kind: "pack", mine: true, status: "published" },
      false
    ).map((item) => item.id)
    expect(ids).toEqual(["share", "copy"])
  })

  it("has nothing to offer on Favourites", () => {
    expect(
      packMenu({ kind: "favourites", mine: true, status: "published" }, true)
    ).toEqual([])
  })

  it("wants a title with words in it, within the limit", () => {
    expect(packTitleReady("  ")).toBe(false)
    expect(packTitleReady("Exam season")).toBe(true)
    expect(packTitleReady("x".repeat(61))).toBe(false)
  })
})
