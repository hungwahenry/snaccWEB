import { describe, expect, it } from "vitest"
import { isReady, upcomingImage } from "./playback"

const image = { url: "a.jpg" }

describe("isReady", () => {
  it("holds a picture moment until the picture has loaded", () => {
    expect(isReady({ id: "m", image }, new Set())).toBe(false)
    expect(isReady({ id: "m", image }, new Set(["m"]))).toBe(true)
    expect(isReady({ id: "t", image: null }, new Set())).toBe(true)
  })
})

describe("upcomingImage", () => {
  it("names the next picture to load ahead", () => {
    const run = [{ image }, { image: null }, { image: { url: "b.jpg" } }]
    expect(upcomingImage(run, 0)).toBeNull()
    expect(upcomingImage(run, 1)).toBe("b.jpg")
    expect(upcomingImage(run, 2)).toBeNull()
  })
})
