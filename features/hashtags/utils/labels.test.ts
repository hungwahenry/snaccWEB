import { describe, expect, it } from "vitest"
import { hashtagKeys } from "./keys"
import { hashtagLabel, hashtagUsage, tagFromParam } from "./labels"
import { uniqueHashtags } from "./unique"

describe("hashtag labels", () => {
  it("writes a tag with its hash", () => {
    expect(hashtagLabel("freshers")).toBe("#freshers")
  })

  it("counts snaccs with the right plural", () => {
    expect(hashtagUsage({ tag: "a", usage_count: 1 })).toBe("1 snacc")
    expect(hashtagUsage({ tag: "a", usage_count: 3 })).toBe("3 snaccs")
    expect(hashtagUsage({ tag: "a", usage_count: 1200 })).toBe("1.2k snaccs")
  })
})

describe("tagFromParam", () => {
  it("decodes an escaped tag", () => {
    expect(tagFromParam("caf%C3%A9")).toBe("café")
  })

  it("keeps a malformed escape as typed", () => {
    expect(tagFromParam("100%")).toBe("100%")
  })
})

describe("uniqueHashtags", () => {
  it("keeps the first of each tag", () => {
    expect(
      uniqueHashtags([
        { tag: "a", usage_count: 3 },
        { tag: "b", usage_count: 2 },
        { tag: "a", usage_count: 4 },
      ])
    ).toEqual([
      { tag: "a", usage_count: 3 },
      { tag: "b", usage_count: 2 },
    ])
  })
})

describe("hashtagKeys", () => {
  it("keeps suggestions and popular apart", () => {
    const popular = hashtagKeys.popular()
    const suggestions = hashtagKeys.suggestions("po")
    expect(suggestions.slice(0, popular.length)).not.toEqual(popular)
  })
})
