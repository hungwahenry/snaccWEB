import { describe, expect, it } from "vitest"
import { realtimeRooms } from "@/providers/realtime-rooms"
import { withNewPoster } from "./new-posters"
import {
  FEED_EMPTY,
  FEED_FAILED,
  feedTabs,
  liveFeedRoom,
  scopeAllowed,
} from "./scopes"
import { feedSortOf } from "./sorts"

describe("withNewPoster", () => {
  it("adds each poster once and keeps the newest three", () => {
    let posters = withNewPoster([], { actor_id: "a", avatar_url: "a.png" })
    posters = withNewPoster(posters, { actor_id: "a" })
    posters = withNewPoster(posters, { actor_id: "b" })
    posters = withNewPoster(posters, { actor_id: "c" })
    posters = withNewPoster(posters, { actor_id: "d" })

    expect(posters.map((poster) => poster.key)).toEqual(["b", "c", "d"])
  })

  it("keeps the picture of a named poster", () => {
    expect(withNewPoster([], { actor_id: "a", avatar_url: "a.png" })).toEqual([
      { key: "a", avatarUrl: "a.png", anonymous: false },
    ])
  })

  it("shows anonymous posters as one ghost with no picture", () => {
    const posters = withNewPoster(
      withNewPoster([], { anonymous: true, avatar_url: "leak.png" }),
      { anonymous: true }
    )
    expect(posters).toEqual([
      { key: "ghost", avatarUrl: null, anonymous: true },
    ])
  })

  it("skips events without a poster", () => {
    const posters = withNewPoster([], { actor_id: "a" })
    expect(withNewPoster(posters, {})).toBe(posters)
  })
})

describe("feed scopes", () => {
  it("always offers campus and the others only when switched on", () => {
    expect(
      feedTabs({ following: false, global: false }).map((tab) => tab.value)
    ).toEqual(["campus"])
    expect(
      feedTabs({ following: true, global: true }).map((tab) => tab.value)
    ).toEqual(["campus", "following", "global"])
  })

  it("only allows a feed that is switched on", () => {
    expect(scopeAllowed("global", { following: true, global: false })).toBe(
      false
    )
    expect(scopeAllowed("following", { following: true, global: false })).toBe(
      true
    )
    expect(scopeAllowed("campus", { following: false, global: false })).toBe(
      true
    )
  })

  it("has copy for every feed", () => {
    for (const scope of ["campus", "global", "following"] as const) {
      expect(FEED_EMPTY[scope].title).toBeTruthy()
      expect(FEED_FAILED[scope]).toBeTruthy()
    }
  })
})

describe("liveFeedRoom", () => {
  it("listens to your campus or everyone when the feed is newest first", () => {
    expect(liveFeedRoom("campus", "latest", "unilag")).toBe(
      realtimeRooms.feedCampus("unilag")
    )
    expect(liveFeedRoom("global", "latest", "unilag")).toBe(
      realtimeRooms.feedGlobal
    )
  })

  it("does not listen to ranked feeds, the following feed, or a missing campus", () => {
    expect(liveFeedRoom("campus", "top", "unilag")).toBeNull()
    expect(liveFeedRoom("global", "top", null)).toBeNull()
    expect(liveFeedRoom("following", "latest", "unilag")).toBeNull()
    expect(liveFeedRoom("campus", "latest", null)).toBeNull()
  })
})

describe("feedSortOf", () => {
  it("reads back known sorts and drops anything else", () => {
    expect(feedSortOf("top")).toBe("top")
    expect(feedSortOf("latest")).toBe("latest")
    expect(feedSortOf("newest")).toBeNull()
    expect(feedSortOf(null)).toBeNull()
  })
})
