import { describe, expect, it } from "vitest"
import {
  fitContain,
  focalTranslate,
  glideTo,
  panBounds,
  rubberBand,
  shouldDismiss,
  tapZoomTranslate,
  turnAfterSwipe,
  velocityOf,
} from "./geometry"

const screen = { width: 400, height: 800 }
const center = { x: 200, y: 400 }

describe("fitContain", () => {
  it("fits a wide photo to the width and a tall one to the height", () => {
    expect(fitContain({ width: 2000, height: 1000 }, screen)).toEqual({
      width: 400,
      height: 200,
    })
    expect(fitContain({ width: 500, height: 2000 }, screen)).toEqual({
      width: 200,
      height: 800,
    })
  })

  it("fills the box when the photo size is unknown", () => {
    expect(fitContain(null, screen)).toEqual(screen)
    expect(fitContain({ width: 0, height: 0 }, screen)).toEqual(screen)
  })
})

describe("panBounds", () => {
  it("lets a zoomed photo move only as far as it overhangs the screen", () => {
    const fit = { width: 400, height: 200 }
    expect(panBounds(fit, 1, screen)).toEqual({ x: 0, y: 0 })
    expect(panBounds(fit, 3, screen)).toEqual({ x: 400, y: 0 })
    expect(panBounds(fit, 5, screen)).toEqual({ x: 800, y: 100 })
  })
})

describe("rubberBand", () => {
  it("resists more the further it is pulled, keeping the direction", () => {
    const short = rubberBand(50, 400)
    const long = rubberBand(200, 400)
    expect(short).toBeGreaterThan(0)
    expect(short).toBeLessThan(50)
    expect(long).toBeLessThan(200)
    expect(long).toBeGreaterThan(short)
    expect(rubberBand(-50, 400)).toBeCloseTo(-short)
    expect(rubberBand(0, 400)).toBe(0)
  })
})

describe("focalTranslate", () => {
  it("keeps the point between the fingers still while zooming", () => {
    const focal = { x: 300, y: 500 }
    const translate = focalTranslate(
      { focal, translate: { x: 0, y: 0 }, scale: 1 },
      focal,
      2,
      center
    )
    expect(translate).toEqual({ x: -100, y: -100 })
  })

  it("follows the fingers when they move together", () => {
    const start = {
      focal: { x: 200, y: 400 },
      translate: { x: 0, y: 0 },
      scale: 2,
    }
    expect(focalTranslate(start, { x: 230, y: 420 }, 2, center)).toEqual({
      x: 30,
      y: 20,
    })
  })
})

describe("tapZoomTranslate", () => {
  it("zooms toward the tapped spot, within the bounds", () => {
    expect(
      tapZoomTranslate({ x: 300, y: 400 }, center, 2, { x: 400, y: 400 })
    ).toEqual({ x: -100, y: -0 })
    expect(
      tapZoomTranslate({ x: 0, y: 400 }, center, 3, { x: 100, y: 0 })
    ).toEqual({ x: 100, y: -0 })
  })
})

describe("turnAfterSwipe", () => {
  it("turns the page on a long or fast enough swipe", () => {
    expect(turnAfterSwipe(-150, 0, 400)).toBe(1)
    expect(turnAfterSwipe(150, 0, 400)).toBe(-1)
    expect(turnAfterSwipe(-40, -900, 400)).toBe(1)
  })

  it("stays put on a short slow swipe or a flick the other way", () => {
    expect(turnAfterSwipe(-40, -100, 400)).toBe(0)
    expect(turnAfterSwipe(-40, 900, 400)).toBe(0)
    expect(turnAfterSwipe(0, 900, 400)).toBe(0)
  })
})

describe("shouldDismiss", () => {
  it("closes on a long or fast drag in either direction", () => {
    expect(shouldDismiss(150, 0, 800)).toBe(true)
    expect(shouldDismiss(-150, 0, 800)).toBe(true)
    expect(shouldDismiss(30, 1200, 800)).toBe(true)
  })

  it("springs back from a short drag or one flicked back the other way", () => {
    expect(shouldDismiss(30, 100, 800)).toBe(false)
    expect(shouldDismiss(60, -1200, 800)).toBe(false)
    expect(shouldDismiss(0, 0, 800)).toBe(false)
  })
})

describe("velocityOf", () => {
  it("measures the speed over the last moments of the drag", () => {
    expect(
      velocityOf([
        { x: 0, y: 0, time: 0 },
        { x: 10, y: 0, time: 200 },
        { x: 30, y: -20, time: 250 },
        { x: 60, y: -50, time: 300 },
      ])
    ).toEqual({ x: 500, y: -500 })
  })

  it("is still when there is nothing to measure", () => {
    expect(velocityOf([])).toEqual({ x: 0, y: 0 })
    expect(velocityOf([{ x: 5, y: 5, time: 10 }])).toEqual({ x: 0, y: 0 })
  })
})

describe("glideTo", () => {
  it("carries on in the flick's direction but stops at the edge", () => {
    expect(glideTo(0, 500, 300)).toBe(100)
    expect(glideTo(250, 1000, 300)).toBe(300)
    expect(glideTo(0, -5000, 300)).toBe(-300)
  })
})
