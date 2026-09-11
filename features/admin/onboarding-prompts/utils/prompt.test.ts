import { describe, expect, it } from "vitest"
import {
  draftFrom,
  isDraftReady,
  parsePosition,
  POSITION_INVALID,
  toInput,
} from "./prompt"

const ready = {
  emoji: "🔥",
  label: "Hot take",
  placeholder: "Drop a hot take about {campus}…",
  position: "3",
}

describe("draftFrom", () => {
  it("starts a new prompt blank at position 0", () => {
    expect(draftFrom()).toEqual({
      emoji: "",
      label: "",
      placeholder: "",
      position: "0",
    })
  })

  it("fills from an existing prompt", () => {
    expect(
      draftFrom({
        id: "p1",
        emoji: "🔥",
        label: "Hot take",
        placeholder: "Go on",
        position: 4,
        created_at: "2026-01-01T00:00:00.000Z",
      })
    ).toEqual({
      emoji: "🔥",
      label: "Hot take",
      placeholder: "Go on",
      position: "4",
    })
  })
})

describe("parsePosition", () => {
  it("takes whole numbers from 0 to 1000 only", () => {
    expect(parsePosition("0")).toBe(0)
    expect(parsePosition(" 1000 ")).toBe(1000)
    expect(parsePosition("1001")).toBeNull()
    expect(parsePosition("-1")).toBeNull()
    expect(parsePosition("2.5")).toBeNull()
    expect(parsePosition("")).toBeNull()
    expect(parsePosition("first")).toBeNull()
  })
})

describe("isDraftReady", () => {
  it("needs an emoji, a label and a placeholder", () => {
    expect(isDraftReady(ready)).toBe(true)
    expect(isDraftReady({ ...ready, emoji: " " })).toBe(false)
    expect(isDraftReady({ ...ready, label: "" })).toBe(false)
    expect(isDraftReady({ ...ready, placeholder: "" })).toBe(false)
  })

  it("refuses a position that is not a whole number in range", () => {
    expect(isDraftReady({ ...ready, position: "abc" })).toBe(false)
    expect(isDraftReady({ ...ready, position: "5000" })).toBe(false)
  })

  it("holds the text limits", () => {
    expect(isDraftReady({ ...ready, label: "x".repeat(101) })).toBe(false)
    expect(isDraftReady({ ...ready, placeholder: "x".repeat(201) })).toBe(false)
  })
})

describe("toInput", () => {
  it("trims and turns the position into a number", () => {
    expect(toInput({ ...ready, label: " Hot take ", position: " 7 " })).toEqual(
      {
        emoji: "🔥",
        label: "Hot take",
        placeholder: "Drop a hot take about {campus}…",
        position: 7,
      }
    )
  })

  it("refuses a typo in the position instead of saving it as 0", () => {
    expect(() => toInput({ ...ready, position: "7a" })).toThrow(
      POSITION_INVALID
    )
  })
})
