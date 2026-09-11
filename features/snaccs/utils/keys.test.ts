import { describe, expect, it } from "vitest"
import {
  isCommentList,
  isSnaccDetail,
  isSnaccList,
  isUserList,
  snaccKeys,
} from "./keys"

describe("snaccKeys", () => {
  it("puts every list of snaccs under one root", () => {
    const lists = [
      snaccKeys.feed("campus", "top"),
      snaccKeys.user("Bola", "media"),
      snaccKeys.bookmarks(),
      snaccKeys.hashtag("Exams"),
      snaccKeys.search("exam"),
      snaccKeys.campus("UNILAG"),
      snaccKeys.match("m1"),
      snaccKeys.comments("s1", "newest"),
      snaccKeys.quotes("s1"),
    ]
    lists.forEach((key) => expect(isSnaccList(key)).toBe(true))
    expect(isSnaccList(snaccKeys.detail("s1"))).toBe(false)
    expect(isSnaccDetail(snaccKeys.detail("s1"))).toBe(true)
  })

  it("keeps a snacc apart from its comments and summaries", () => {
    const detail = snaccKeys.detail("s1")
    const others = [
      snaccKeys.reactionSummary("s1"),
      snaccKeys.resnaccSummary("s1"),
      snaccKeys.comments("s1", "top"),
    ]
    others.forEach((key) =>
      expect(key.slice(0, detail.length)).not.toEqual(detail)
    )
  })

  it("matches the comment lists of one snacc, whatever the sort", () => {
    expect(isCommentList(snaccKeys.comments("s1", "oldest"), "s1")).toBe(true)
    expect(isCommentList(snaccKeys.comments("s2", "oldest"), "s1")).toBe(false)
  })

  it("matches a profile's tabs without caring how the name was typed", () => {
    const key = snaccKeys.user("Bola", "media")
    expect(isUserList(key, "bola", ["snaccs", "media"])).toBe(true)
    expect(isUserList(key, "bola", ["snaccs"])).toBe(false)
  })
})
