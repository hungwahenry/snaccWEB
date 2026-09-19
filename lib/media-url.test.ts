import { describe, expect, it } from "vitest"
import { isProxyableMedia, isServableMedia, sameOriginMedia } from "./media-url"

describe("isProxyableMedia", () => {
  it("accepts only our media host over https", () => {
    expect(isProxyableMedia("https://media.snacc.fyi/a.jpg")).toBe(true)
    expect(isProxyableMedia("http://media.snacc.fyi/a.jpg")).toBe(false)
    expect(isProxyableMedia("https://evil.example/a.jpg")).toBe(false)
    expect(isProxyableMedia("not a url")).toBe(false)
  })

  it("rewrites only what it would proxy", () => {
    expect(sameOriginMedia("https://media.snacc.fyi/a.jpg")).toBe(
      "/api/media?url=https%3A%2F%2Fmedia.snacc.fyi%2Fa.jpg"
    )
    expect(sameOriginMedia("https://evil.example/a.jpg")).toBe(
      "https://evil.example/a.jpg"
    )
  })
})

describe("isServableMedia", () => {
  it("serves pictures, video and sound", () => {
    expect(isServableMedia("image/jpeg")).toBe(true)
    expect(isServableMedia("video/mp4; codecs=avc1")).toBe(true)
    expect(isServableMedia("audio/mp4")).toBe(true)
  })

  it("never serves a page, a script or an svg from our own origin", () => {
    expect(isServableMedia("text/html")).toBe(false)
    expect(isServableMedia("application/javascript")).toBe(false)
    expect(isServableMedia("image/svg+xml")).toBe(false)
  })
})
