import { describe, expect, it } from "vitest"
import type { AdminStickerPack, PackSticker } from "../types"
import {
  addedMessage,
  catalogNote,
  deleteNote,
  failedMessage,
  featureNote,
  isFeatured,
  LISTED_FILTERS,
  LISTED_OPTIONS,
  OWNER_FILTERS,
  OWNER_OPTIONS,
  ownerLabel,
  packAbilities,
  packBadges,
  packListQuery,
  packSavedMessage,
  pngName,
  progressLabel,
  progressValue,
  splitStickers,
  STATUS_FILTERS,
  STATUS_OPTIONS,
  stickerBadges,
  stickerNote,
  stickersSummary,
  stickerSrc,
  takeDownNote,
  TITLE_MAX,
  toTitle,
  traysNote,
} from "./packs"

const ada = {
  id: "u1",
  username: "ada",
  display_name: "Ada",
  avatar_url: "",
}

const pack = (patch: Partial<AdminStickerPack> = {}): AdminStickerPack => ({
  id: "p1",
  title: "Exam season",
  owner: null,
  status: "draft",
  premium: false,
  added_by_default: false,
  listed_at: null,
  published_at: null,
  saves_count: 0,
  open_reports: 0,
  created_at: "2026-10-01T00:00:00Z",
  updated_at: "2026-10-01T00:00:00Z",
  cover: null,
  stickers_count: 3,
  ...patch,
})

const sticker = (patch: Partial<PackSticker> = {}): PackSticker => ({
  id: "k1",
  pack_id: "p1",
  source: "upload",
  format: "static",
  url: "k1.webp",
  preview_url: null,
  width: 512,
  height: 512,
  premium: false,
  held: false,
  held_at: null,
  removed_at: null,
  ...patch,
})

describe("filters", () => {
  it("offers a choice for every value the URL accepts", () => {
    expect(OWNER_OPTIONS.map((option) => option.value)).toEqual([
      ...OWNER_FILTERS,
    ])
    expect(STATUS_OPTIONS.map((option) => option.value)).toEqual([
      ...STATUS_FILTERS,
    ])
    expect(LISTED_OPTIONS.map((option) => option.value)).toEqual([
      ...LISTED_FILTERS,
    ])
  })

  it("sends only the filters that are set", () => {
    expect(
      packListQuery(
        { page: 1, q: "  ", owner: null, status: null, listed: null },
        20
      )
    ).toEqual({
      page: 1,
      perPage: 20,
      q: undefined,
      owner: undefined,
      status: undefined,
      listed: undefined,
    })
    expect(
      packListQuery(
        {
          page: 2,
          q: " exam ",
          owner: "people",
          status: "published",
          listed: "false",
        },
        20
      )
    ).toEqual({
      page: 2,
      perPage: 20,
      q: "exam",
      owner: "people",
      status: "published",
      listed: false,
    })
  })
})

describe("packBadges", () => {
  it("shows the status, then Premium and every tray", () => {
    expect(
      packBadges(
        pack({ status: "published", premium: true, added_by_default: true })
      ).map((badge) => badge.label)
    ).toEqual(["Published", "Premium", "In every tray"])
  })

  it("calls a listed pack of someone's featured, but not one of Snacc's", () => {
    const listed = "2026-10-02T00:00:00Z"
    expect(
      packBadges(pack({ owner: ada, listed_at: listed })).map((b) => b.label)
    ).toContain("Featured")
    expect(isFeatured(pack({ listed_at: listed }))).toBe(false)
  })
})

describe("ownerLabel", () => {
  it("names Snacc for its own packs", () => {
    expect(ownerLabel(pack())).toBe("Snacc")
    expect(ownerLabel(pack({ owner: ada }))).toBe("@ada")
  })
})

describe("packAbilities", () => {
  it("lets a fresh Snacc draft be published or deleted", () => {
    expect(packAbilities(pack())).toEqual({
      curate: true,
      publish: true,
      publishReady: true,
      unpublish: false,
      addToTrays: false,
      remove: true,
      feature: false,
      takeDown: false,
    })
  })

  it("holds publishing back until the pack has stickers", () => {
    expect(packAbilities(pack({ stickers_count: 0 })).publishReady).toBe(false)
  })

  it("offers unpublishing, not deleting, once a Snacc pack went out", () => {
    const published = pack({
      status: "published",
      published_at: "2026-10-02T00:00:00Z",
    })
    expect(packAbilities(published)).toMatchObject({
      publish: false,
      unpublish: true,
      addToTrays: true,
      remove: false,
    })
    expect(packAbilities({ ...published, status: "draft" })).toMatchObject({
      publish: true,
      remove: false,
    })
  })

  it("lets people's packs be featured or taken down, never edited", () => {
    expect(
      packAbilities(pack({ owner: ada, status: "published" }))
    ).toMatchObject({
      curate: false,
      publish: false,
      remove: false,
      feature: true,
      takeDown: true,
    })
    expect(
      packAbilities(pack({ owner: ada, status: "taken_down" }))
    ).toMatchObject({ feature: false, takeDown: false })
  })
})

describe("notes", () => {
  it("explains where a pack stands in the catalog", () => {
    expect(catalogNote(pack({ stickers_count: 0 }))).toMatch(/Add stickers/)
    expect(catalogNote(pack())).toMatch(/Publishing puts it/)
    expect(catalogNote(pack({ published_at: "2026-10-02T00:00:00Z" }))).toMatch(
      /Back to a draft/
    )
    expect(catalogNote(pack({ status: "published" }))).toMatch(/In the catalog/)
  })

  it("explains every tray", () => {
    expect(traysNote(pack())).toBe("Publish the pack first.")
    expect(traysNote(pack({ status: "published" }))).toMatch(/joins later/)
    expect(
      traysNote(pack({ status: "published", added_by_default: true }))
    ).toMatch(/^In everyone's tray/)
  })

  it("says why a pack that went out can't be deleted", () => {
    expect(deleteNote(pack())).toMatch(/never went out/)
    expect(
      deleteNote(
        pack({ status: "published", published_at: "2026-10-02T00:00:00Z" })
      )
    ).toMatch(/Unpublish it instead/)
    expect(deleteNote(pack({ published_at: "2026-10-02T00:00:00Z" }))).toMatch(
      /As a draft/
    )
  })

  it("explains featuring and taking down", () => {
    expect(featureNote(pack({ status: "published" }))).toMatch(/catalog/)
    expect(featureNote(pack({ status: "taken_down" }))).toMatch(/taken down/)
    expect(featureNote(pack())).toMatch(/published/)
    expect(takeDownNote(pack())).toMatch(/no undo/)
    expect(takeDownNote(pack({ status: "taken_down" }))).toMatch(/^Taken down/)
  })

  it("says what a save changed", () => {
    expect(packSavedMessage({ title: "New" })).toBe("Pack renamed.")
    expect(packSavedMessage({ premium: true })).toMatch(/Premium/)
    expect(packSavedMessage({ premium: false })).toMatch(/^Anyone/)
  })
})

describe("stickers", () => {
  const live = sticker({ id: "a" })
  const held = sticker({ id: "b", held_at: "2026-10-03T00:00:00Z" })
  const removed = sticker({ id: "c", removed_at: "2026-10-04T00:00:00Z" })

  it("keeps removed stickers apart from the rest", () => {
    expect(splitStickers([live, removed, held])).toEqual({
      live: [live, held],
      removed: [removed],
    })
  })

  it("counts what is live, held and removed", () => {
    expect(stickersSummary({ live: [live, held], removed: [removed] })).toBe(
      "2 stickers · 1 held · 1 removed"
    )
    expect(stickersSummary({ live: [], removed: [] })).toBe("0 stickers")
  })

  it("marks held and removed stickers", () => {
    expect(stickerBadges(live)).toEqual([])
    expect(stickerBadges(held).map((badge) => badge.label)).toEqual(["Held"])
    expect(stickerBadges(removed).map((badge) => badge.label)).toEqual([
      "Removed",
    ])
    expect(stickerNote(live)).toBeNull()
    expect(stickerNote(held)).toMatch(/^Held /)
    expect(stickerNote(removed)).toMatch(/^Removed /)
  })

  it("hides the image of a removed sticker", () => {
    expect(stickerSrc(live)).toBe("k1.webp")
    expect(stickerSrc(removed)).toBeNull()
  })
})

describe("toTitle", () => {
  it("trims the name and refuses a blank or overlong one", () => {
    expect(toTitle({ title: "  Exam season " })).toBe("Exam season")
    expect(toTitle({ title: "  " })).toBeNull()
    expect(toTitle({ title: "x".repeat(TITLE_MAX + 1) })).toBeNull()
  })
})

describe("uploads", () => {
  it("says how many were added", () => {
    expect(addedMessage(1, 1)).toBe("1 sticker added.")
    expect(addedMessage(3, 3)).toBe("3 stickers added.")
    expect(addedMessage(2, 3)).toBe("2 of 3 stickers added.")
  })

  it("names the first image that failed", () => {
    expect(failedMessage([])).toBeNull()
    expect(failedMessage([{ name: "a.png", message: "Too big." }])).toBe(
      "“a.png” wasn't added. Too big."
    )
    expect(
      failedMessage([
        { name: "a.png", message: "Too big." },
        { name: "b.png", message: "Wrong type." },
      ])
    ).toBe("2 images weren't added. “a.png”: Too big.")
  })

  it("shows which image is going up", () => {
    expect(progressLabel({ done: 0, total: 4 })).toBe("Adding 1 of 4…")
    expect(progressValue({ done: 1, total: 4 })).toBe(25)
    expect(progressValue({ done: 0, total: 0 })).toBe(0)
  })
})

describe("pngName", () => {
  it("names the fitted file as a PNG, whatever it was", () => {
    expect(pngName("party.jpg")).toBe("party.png")
    expect(pngName("cat.photo.webp")).toBe("cat.photo.png")
    expect(pngName("no-extension")).toBe("no-extension.png")
    expect(pngName(".jpg")).toBe("sticker.png")
  })
})
