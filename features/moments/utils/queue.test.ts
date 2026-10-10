import { describe, expect, it } from "vitest"
import type { TrayEntry } from "../types"
import { playQueue, soonestExpiry } from "./queue"

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

describe("playQueue", () => {
  const author = (id: string, mine = false) =>
    ({ author: { id }, mine }) as TrayEntry

  it("plays the tray from your own ring when the opened author is in it", () => {
    const queue = playQueue([author("a"), author("me", true)], "a")
    expect(queue.map((entry) => entry.author.id)).toEqual(["me", "a"])
  })

  it("plays only the opened author when they are not in your tray, as after a mention", () => {
    expect(playQueue([author("a")], "stranger")).toEqual([])
  })
})
