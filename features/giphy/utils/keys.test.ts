import { describe, expect, it } from "vitest"
import { giphyKeys } from "./keys"

describe("giphyKeys", () => {
  it("keeps GIFs and stickers apart", () => {
    expect(giphyKeys.trending("gifs")).toEqual(["giphy", "gifs", "trending"])
    expect(giphyKeys.trending("stickers")).toEqual([
      "giphy",
      "stickers",
      "trending",
    ])
  })

  it("keys a search by its words", () => {
    expect(giphyKeys.search("gifs", "cat")).toEqual([
      "giphy",
      "gifs",
      "search",
      "cat",
    ])
  })

  it("never lets trending and a search share a prefix", () => {
    const trending = giphyKeys.trending("gifs")
    const search = giphyKeys.search("gifs", "trending")
    expect(search.slice(0, trending.length)).not.toEqual(trending)
  })
})
