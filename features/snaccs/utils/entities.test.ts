import { describe, expect, it } from "vitest"
import { activeToken, tagLimitProblem, toSegments } from "./entities"

const LIMITS = { maxMentions: 2, maxHashtags: 2, maxCashtags: 2 }

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

  it("caps distinct coins and ignores money", () => {
    expect(tagLimitProblem("$btc $BTC $eth", LIMITS)).toBeNull()
    expect(tagLimitProblem("$btc $eth $sol", LIMITS)).toBe(
      "You can tag up to 2 coins in one snacc."
    )
    expect(tagLimitProblem("$100 $200 $300", LIMITS)).toBeNull()
  })
})

describe("activeToken", () => {
  it("opens the coin picker after a $ and closes it on a stray character", () => {
    expect(activeToken("buying $bt", 10)).toEqual({
      kind: "cashtag",
      term: "bt",
      start: 7,
      end: 10,
    })
    expect(activeToken("pay$bt", 6)).toBeNull()
    expect(activeToken("$bt_c", 5)).toBeNull()
  })

  it("still opens hashtags and mentions", () => {
    expect(activeToken("#ca", 3)?.kind).toBe("hashtag")
    expect(activeToken("@ad", 3)?.kind).toBe("mention")
  })
})

describe("toSegments", () => {
  it("marks a coin as an entity while typing", () => {
    expect(toSegments("watch $btc go")).toEqual([
      { text: "watch ", entity: false },
      { text: "$btc", entity: true },
      { text: " go", entity: false },
    ])
  })
})
