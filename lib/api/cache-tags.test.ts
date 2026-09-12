import { describe, expect, it } from "vitest"
import { userTag } from "./cache-tags"

describe("userTag", () => {
  it("is the same whatever case the name arrives in", () => {
    expect(userTag("Ada")).toBe(userTag("ada"))
  })
})
