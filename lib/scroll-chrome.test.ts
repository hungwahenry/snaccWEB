import { describe, expect, it } from "vitest"
import { nextChrome, RESTING_CHROME, type ChromeScroll } from "./scroll-chrome"

function scroll(...offsets: number[]): ChromeScroll {
  return offsets.reduce(nextChrome, RESTING_CHROME)
}

describe("nextChrome", () => {
  it("takes the first offset as a starting point without hiding", () => {
    expect(scroll(900)).toEqual({ lastY: 900, travel: 0, hidden: false })
  })

  it("hides once scrolling down has travelled far enough", () => {
    expect(scroll(500, 510).hidden).toBe(false)
    expect(scroll(500, 510, 530).hidden).toBe(true)
  })

  it("comes back once scrolling up has travelled far enough", () => {
    expect(scroll(500, 600, 590).hidden).toBe(true)
    expect(scroll(500, 600, 560).hidden).toBe(false)
  })

  it("ignores small jitter in the other direction", () => {
    expect(scroll(500, 600, 595, 610).hidden).toBe(true)
  })

  it("starts counting afresh when the direction changes", () => {
    expect(scroll(500, 600, 580, 590)).toMatchObject({
      travel: 10,
      hidden: true,
    })
  })

  it("always shows near the top", () => {
    expect(scroll(500, 600, 20).hidden).toBe(false)
  })
})
