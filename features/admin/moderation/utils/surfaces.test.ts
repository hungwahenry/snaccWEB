import { describe, expect, it } from "vitest"
import type { ModerationSurface } from "../types"
import {
  SURFACE_KEY_OPTIONS,
  SURFACE_OPTIONS,
  surfaceLabel,
  surfaceState,
} from "./surfaces"

describe("surfaces", () => {
  it("names each surface for people, in a fixed order", () => {
    expect(SURFACE_OPTIONS.map((option) => option.label)).toEqual([
      "Snaccs",
      "Replies",
      "Moments",
      "Ghost messages",
      "Anonymous messages",
      "Profiles",
    ])
  })

  it("names surfaces by key in the rule dialog", () => {
    expect(
      SURFACE_KEY_OPTIONS.find((option) => option.value === "anon_message")
    ).toEqual({ value: "anon_message", label: "anon message" })
  })

  it("falls back to the key for a surface it does not know", () => {
    expect(surfaceLabel("comment")).toBe("Replies")
    expect(surfaceLabel("clip" as ModerationSurface)).toBe("clip")
  })

  it("shows whether a surface is reviewed", () => {
    expect(surfaceState(true)).toEqual({ label: "on", variant: "default" })
    expect(surfaceState(false)).toEqual({ label: "off", variant: "outline" })
  })
})
