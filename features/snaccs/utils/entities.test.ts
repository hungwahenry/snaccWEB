import { describe, expect, it } from "vitest"
import { tagLimitProblem } from "./entities"

const LIMITS = { maxMentions: 2, maxHashtags: 2 }

describe("tagLimitProblem", () => {
  it("is fine up to the limit", () => {
    expect(tagLimitProblem("@ada @bob #one #two", LIMITS)).toBeNull()
  })

  it("names the limit once one person too many is tagged", () => {
    expect(tagLimitProblem("@ada @bob @cat", LIMITS)).toBe(
      "You can tag up to 2 people in one snacc."
    )
  })

  it("names the limit once one hashtag too many is used", () => {
    expect(tagLimitProblem("#one #two #three", LIMITS)).toBe(
      "You can use up to 2 hashtags in one snacc."
    )
  })

  it("counts the same person or hashtag once, however often it appears", () => {
    expect(tagLimitProblem("@ada @Ada @ada #one #ONE #one", LIMITS)).toBeNull()
  })

  it("ignores emails and numbers that only look like tags", () => {
    expect(
      tagLimitProblem("me@ada.com you@bob.com #1 #2 #3", LIMITS)
    ).toBeNull()
  })
})
