import { describe, expect, it } from "vitest"
import type { ConversationPhoto } from "../types"
import { lightboxImagesOf } from "./photos"

describe("lightboxImagesOf", () => {
  it("opens the full photos, not their thumbnails", () => {
    const photo = {
      id: "m1",
      image: {
        id: "m1",
        url: "full.jpg",
        thumb_url: "thumb.jpg",
        width: 800,
        height: 600,
      },
    } as ConversationPhoto
    expect(lightboxImagesOf([photo])).toEqual([
      { url: "full.jpg", width: 800, height: 600 },
    ])
  })
})
