import { describe, expect, it } from "vitest"
import { roomChanges } from "./live-rooms"

describe("roomChanges", () => {
  it("joins what came on screen and leaves what went off it", () => {
    expect(roomChanges(new Set(["a", "b"]), new Set(["b", "c"]))).toEqual({
      join: ["c"],
      leave: ["a"],
    })
  })

  it("does nothing when the same snaccs are still on screen", () => {
    expect(roomChanges(new Set(["a"]), new Set(["a"]))).toEqual({
      join: [],
      leave: [],
    })
  })
})
