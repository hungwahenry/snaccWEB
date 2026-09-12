import { describe, expect, it } from "vitest"
import type { Snacc } from "../types"
import { addresseeOf, repliesLeft } from "./threads"

const reply = (to: Snacc["reply_to_user"]) => ({ reply_to_user: to }) as Snacc

describe("addresseeOf", () => {
  it("names who a reply answers unless it is the thread author", () => {
    const to = { id: "u2", username: "bola", anonymous: false }
    expect(addresseeOf(reply(to), "u1")).toBe(to)
    expect(addresseeOf(reply(to), "u2")).toBeNull()
    expect(addresseeOf(reply(null), "u1")).toBeNull()
  })
})

describe("repliesLeft", () => {
  it("uses the comment's tally until the thread is opened", () => {
    expect(repliesLeft({ open: false, shown: 0, count: 4, total: 2 })).toBe(4)
  })

  it("counts down from what the server will show once opened", () => {
    expect(
      repliesLeft({ open: true, shown: 0, count: 4, total: undefined })
    ).toBe(4)
    expect(repliesLeft({ open: true, shown: 1, count: 4, total: 2 })).toBe(1)
    expect(repliesLeft({ open: true, shown: 3, count: 4, total: 2 })).toBe(0)
  })
})
