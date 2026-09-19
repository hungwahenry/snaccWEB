import { describe, expect, it } from "vitest"
import type { AppConfig } from "@/features/config/types"
import { ApiError } from "@/lib/api/errors"
import { limitKeyOf, offersPremium } from "./limit"

const KEY = "content.snacc.body_max_length"

const config = (premium: boolean, upgrades: Record<string, unknown>) =>
  ({ flags: { premium }, upgrades }) as unknown as AppConfig

const limit = new ApiError(422, "Too long", "premium_limit", {
  premium_limit: KEY,
} as unknown as Record<string, string[]>)

describe("limitKeyOf", () => {
  it("names the config key the server refused on", () => {
    expect(limitKeyOf(limit)).toBe(KEY)
    expect(
      limitKeyOf(new ApiError(422, "Too long", "x", { premium_limit: [KEY] }))
    ).toBe(KEY)
  })

  it("is nothing for any other failure", () => {
    expect(limitKeyOf(new ApiError(500, "Broke"))).toBeNull()
    expect(limitKeyOf(new Error("offline"))).toBeNull()
  })
})

describe("offersPremium", () => {
  it("offers it when Premium is on sale and would raise this limit", () => {
    expect(offersPremium(limit, config(true, { [KEY]: 1000 }), false)).toBe(true)
  })

  it("never offers it to someone who already has it", () => {
    expect(offersPremium(limit, config(true, { [KEY]: 1000 }), true)).toBe(false)
  })

  it("stays quiet when Premium is off, or changes nothing here", () => {
    expect(offersPremium(limit, config(false, { [KEY]: 1000 }), false)).toBe(
      false
    )
    expect(offersPremium(limit, config(true, {}), false)).toBe(false)
    expect(offersPremium(limit, undefined, false)).toBe(false)
  })
})
