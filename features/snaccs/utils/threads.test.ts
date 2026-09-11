import { describe, expect, it } from "vitest"
import type { Snacc } from "../types"
import { addresseeOf } from "./threads"

const reply = (to: Snacc["reply_to_user"]) => ({ reply_to_user: to }) as Snacc

describe("addresseeOf", () => {
  it("names who a reply answers unless it is the thread author", () => {
    const to = { id: "u2", username: "bola", anonymous: false }
    expect(addresseeOf(reply(to), "u1")).toBe(to)
    expect(addresseeOf(reply(to), "u2")).toBeNull()
    expect(addresseeOf(reply(null), "u1")).toBeNull()
  })
})
