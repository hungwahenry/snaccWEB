import { describe, expect, it } from "vitest"
import type { AdminReservedUsername } from "../types"
import {
  collidesWithRoute,
  filterHeld,
  isHoldReady,
  toHoldInput,
} from "./reserved-usernames"

const held = (
  name: string,
  reason: string,
  seeded = true
): AdminReservedUsername => ({
  name,
  reason,
  seeded,
  created_at: "2026-01-01T00:00:00.000Z",
})

describe("filterHeld", () => {
  const names = [
    held("settings", "App route"),
    held("snacchq", "Could be mistaken for Snacc"),
  ]

  it("keeps everything for an empty search", () => {
    expect(filterHeld(names, "  ")).toBe(names)
  })

  it("matches the name or the reason, ignoring case", () => {
    expect(filterHeld(names, "SETT")).toEqual([names[0]])
    expect(filterHeld(names, "mistaken")).toEqual([names[1]])
    expect(filterHeld(names, "nobody")).toEqual([])
  })
})

describe("collidesWithRoute", () => {
  it("spots a name held because it is a URL", () => {
    expect(collidesWithRoute(held("settings", "App Route"))).toBe(true)
    expect(collidesWithRoute(held("api", "Reserved path"))).toBe(true)
    expect(collidesWithRoute(held("snacchq", "Brand"))).toBe(false)
  })
})

describe("holding a name", () => {
  it("needs both a name and a reason", () => {
    expect(isHoldReady({ name: "snacchq", reason: "Brand" })).toBe(true)
    expect(isHoldReady({ name: " ", reason: "Brand" })).toBe(false)
    expect(isHoldReady({ name: "snacchq", reason: "" })).toBe(false)
  })

  it("lowercases the name and trims both", () => {
    expect(toHoldInput({ name: " SnaccHQ ", reason: " Brand " })).toEqual({
      name: "snacchq",
      reason: "Brand",
    })
  })
})
