import { beforeEach, describe, expect, it } from "vitest"
import { forgetPlace, placeIn, rememberPlace } from "./place"

describe("the viewer's place", () => {
  beforeEach(forgetPlace)

  it("brings you back to the clip you left on", () => {
    rememberPlace("first", "tenth")
    expect(placeIn("first")).toBe("tenth")
  })

  it("belongs to the viewer it was left in, not another one", () => {
    rememberPlace("first", "tenth")
    expect(placeIn("other")).toBeNull()
  })

  it("is gone once it is forgotten", () => {
    rememberPlace("first", "tenth")
    forgetPlace()
    expect(placeIn("first")).toBeNull()
  })
})
