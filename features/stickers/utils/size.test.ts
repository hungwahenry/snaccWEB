import { describe, expect, it } from "vitest"
import { stickerBox } from "./size"

describe("stickerBox", () => {
  it("fills the width for a wide sticker", () => {
    expect(stickerBox({ width: 200, height: 100 }, 120)).toEqual({
      width: 120,
      height: 60,
    })
  })

  it("fills the height for a tall sticker", () => {
    expect(stickerBox({ width: 100, height: 200 }, 120)).toEqual({
      width: 60,
      height: 120,
    })
  })

  it("treats a sticker with no size as square", () => {
    expect(stickerBox({ width: 0, height: 0 }, 120)).toEqual({
      width: 120,
      height: 120,
    })
  })
})
