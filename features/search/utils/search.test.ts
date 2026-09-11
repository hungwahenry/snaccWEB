import { describe, expect, it } from "vitest"
import { searchPath } from "../routes"
import { searchKeys } from "./keys"
import { SEARCH_EMPTY, SEARCH_TAB_PILLS, SEARCH_TABS } from "./tabs"
import { searchTermFor } from "./terms"

describe("searchTermFor", () => {
  it("drops the hash people type in front of a tag", () => {
    expect(searchTermFor("tags", "#freshers")).toBe("freshers")
    expect(searchTermFor("tags", "##")).toBe("")
  })

  it("drops the at sign people type in front of a username", () => {
    expect(searchTermFor("people", "@ada")).toBe("ada")
  })

  it("leaves snaccs and campuses as typed", () => {
    expect(searchTermFor("snaccs", "#freshers")).toBe("#freshers")
    expect(searchTermFor("campuses", "@unilag")).toBe("@unilag")
  })
})

describe("searchPath", () => {
  it("is the bare page with nothing to search", () => {
    expect(searchPath()).toBe("/search")
    expect(searchPath({ q: "  " })).toBe("/search")
  })

  it("carries the words and the tab", () => {
    expect(searchPath({ q: "ada lovelace", tab: "people" })).toBe(
      "/search?q=ada+lovelace&tab=people"
    )
    expect(searchPath({ tab: "tags" })).toBe("/search?tab=tags")
  })
})

describe("search tabs", () => {
  it("has a pill and an empty state for every tab", () => {
    expect(SEARCH_TAB_PILLS.map((pill) => pill.value)).toEqual([...SEARCH_TABS])
    for (const tab of SEARCH_TABS) expect(SEARCH_EMPTY[tab].title).toBeTruthy()
  })
})

describe("searchKeys", () => {
  it("keeps tag and campus results apart", () => {
    expect(searchKeys.hashtags("a")).not.toEqual(searchKeys.campuses("a"))
  })
})
