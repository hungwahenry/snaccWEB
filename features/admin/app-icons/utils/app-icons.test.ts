import { describe, expect, it } from "vitest"
import type { AdminAppIcon } from "../types"
import {
  appIconDraft,
  appIconMessage,
  canMove,
  LABEL_MAX,
  swapWithNeighbour,
  toLabel,
} from "./app-icons"

const icon = (patch: Partial<AdminAppIcon> = {}): AdminAppIcon => ({
  id: "i1",
  key: "classic",
  label: "Classic",
  position: 0,
  enabled: true,
  updated_at: "2026-09-01T00:00:00Z",
  ...patch,
})

const icons = [
  icon({ id: "a", position: 0 }),
  icon({ id: "b", position: 1 }),
  icon({ id: "c", position: 5 }),
]

describe("swapWithNeighbour", () => {
  it("swaps positions with the icon above or below", () => {
    expect(swapWithNeighbour(icons, "b", "up")).toEqual([
      { id: "b", position: 0 },
      { id: "a", position: 1 },
    ])
    expect(swapWithNeighbour(icons, "b", "down")).toEqual([
      { id: "b", position: 5 },
      { id: "c", position: 1 },
    ])
  })

  it("goes nowhere past either end, or for an icon it cannot find", () => {
    expect(swapWithNeighbour(icons, "a", "up")).toBeNull()
    expect(swapWithNeighbour(icons, "c", "down")).toBeNull()
    expect(swapWithNeighbour(icons, "zz", "up")).toBeNull()
  })
})

describe("canMove", () => {
  it("only offers a move that has somewhere to go", () => {
    expect(canMove(icons, "a", "up")).toBe(false)
    expect(canMove(icons, "a", "down")).toBe(true)
    expect(canMove(icons, "c", "down")).toBe(false)
  })
})

describe("labels", () => {
  it("starts from the saved name", () => {
    expect(appIconDraft(icon())).toEqual({ label: "Classic" })
  })

  it("trims the name and refuses a blank or overlong one", () => {
    expect(toLabel({ label: "  Night  " })).toBe("Night")
    expect(toLabel({ label: "   " })).toBeNull()
    expect(toLabel({ label: "x".repeat(LABEL_MAX + 1) })).toBeNull()
  })
})

describe("appIconMessage", () => {
  it("says what changed", () => {
    expect(appIconMessage(icon({ label: "Night" }), { label: "Night" })).toBe(
      "Renamed to Night."
    )
    expect(appIconMessage(icon(), { enabled: true })).toBe(
      "Classic is offered in the picker."
    )
    expect(appIconMessage(icon({ enabled: false }), { enabled: false })).toBe(
      "Classic is no longer offered."
    )
  })
})
