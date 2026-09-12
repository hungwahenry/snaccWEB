import { describe, expect, it } from "vitest"
import type { TrayEntry } from "../types"
import { soonestExpiry } from "./queue"

const entry = (next_expiry_at: string) => ({ next_expiry_at }) as TrayEntry

describe("soonestExpiry", () => {
  it("finds when the first ring runs out, and nothing for an empty tray", () => {
    const tray = [
      entry("2026-09-12T10:00:00.000Z"),
      entry("2026-09-12T09:00:00.000Z"),
    ]
    expect(soonestExpiry(tray)).toBe(Date.parse("2026-09-12T09:00:00.000Z"))
    expect(soonestExpiry([])).toBeNull()
  })

  it("ignores a ring that carries no time", () => {
    expect(soonestExpiry([entry("")])).toBeNull()
  })
})
