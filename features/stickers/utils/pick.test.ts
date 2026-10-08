import { describe, expect, it } from "vitest"
import type { Gif } from "@/features/giphy/types"
import type { Sticker, StickerAttachment } from "../types"
import {
  attachmentOfPick,
  pickOfAttachment,
  pickOfGiphy,
  pickOfSticker,
  stickerFields,
} from "./pick"

const sticker: Sticker = {
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
}

const gif: Gif = {
  id: "g1",
  url: "https://giphy.test/g1.gif",
  preview_url: "https://giphy.test/g1-small.gif",
  width: 200,
  height: 150,
  title: "Wave",
}

const attachment = (
  over: Partial<StickerAttachment> = {}
): StickerAttachment => ({
  sticker_id: null,
  pack_id: null,
  giphy_id: null,
  url: "https://media.test/sent.png",
  preview_url: null,
  width: 300,
  height: 200,
  removed: false,
  ...over,
})

describe("picks", () => {
  it("sends a pack sticker by its id", () => {
    const pick = pickOfSticker(sticker)

    expect(pick).toMatchObject({ kind: "pack", stickerId: "s1" })
    expect(stickerFields(pick)).toEqual({ stickerId: "s1" })
  })

  it("sends a Giphy sticker straight by its Giphy id", () => {
    const pick = pickOfGiphy(gif)

    expect(pick).toMatchObject({ kind: "giphy", giphyId: "g1", width: 200 })
    expect(stickerFields(pick)).toEqual({ giphyStickerId: "g1" })
  })

  it("sends nothing when nothing is picked", () => {
    expect(stickerFields(null)).toEqual({})
  })
})

describe("pickOfAttachment", () => {
  it("keeps a pack sticker by its sticker id", () => {
    expect(
      pickOfAttachment(attachment({ sticker_id: "s1", giphy_id: "g9" }))
    ).toMatchObject({ kind: "pack", stickerId: "s1" })
  })

  it("keeps a Giphy sticker sent straight by its Giphy id", () => {
    expect(pickOfAttachment(attachment({ giphy_id: "g1" }))).toMatchObject({
      kind: "giphy",
      giphyId: "g1",
      url: "https://media.test/sent.png",
    })
  })

  it("has nothing to keep once a sticker is removed or missing", () => {
    expect(
      pickOfAttachment(
        attachment({ sticker_id: "s1", removed: true, url: null })
      )
    ).toBeNull()
    expect(pickOfAttachment(attachment())).toBeNull()
    expect(pickOfAttachment(null)).toBeNull()
  })
})

describe("attachmentOfPick", () => {
  it("shows a pick as a sent sticker while it goes out", () => {
    expect(attachmentOfPick(pickOfSticker(sticker))).toEqual({
      sticker_id: "s1",
      pack_id: null,
      giphy_id: null,
      url: "https://media.test/s1.png",
      preview_url: null,
      width: 512,
      height: 512,
      removed: false,
    })
    expect(attachmentOfPick(pickOfGiphy(gif))).toMatchObject({
      sticker_id: null,
      giphy_id: "g1",
      preview_url: "https://giphy.test/g1-small.gif",
    })
  })
})
