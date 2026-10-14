import { describe, expect, it } from "vitest"
import { toLightboxImage } from "./images"

describe("toLightboxImage", () => {
  it("carries the full photo, its thumbnail and its size", () => {
    expect(
      toLightboxImage({
        url: "full.jpg",
        thumb_url: "thumb.jpg",
        width: 800,
        height: 600,
      })
    ).toEqual({
      url: "full.jpg",
      thumbUrl: "thumb.jpg",
      width: 800,
      height: 600,
    })
  })

  it("leaves out what the photo does not know", () => {
    expect(toLightboxImage({ url: "full.jpg" })).toEqual({
      url: "full.jpg",
      thumbUrl: null,
      width: undefined,
      height: undefined,
    })
  })
})
