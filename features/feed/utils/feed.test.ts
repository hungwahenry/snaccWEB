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
  it("leads with global, always offers campus, and the rest only when switched on", () => {
    expect(
      feedTabs({ following: false, global: false }).map((tab) => tab.value)
    ).toEqual(["campus"])
    expect(
      feedTabs({ following: true, global: true }).map((tab) => tab.value)
    ).toEqual(["global", "campus", "following"])
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
  it("listens to your campus or to everyone", () => {
    expect(liveFeedRoom("campus", "unilag")).toBe(
      realtimeRooms.feedCampus("unilag")
    )
    expect(liveFeedRoom("global", "unilag")).toBe(realtimeRooms.feedGlobal)
  })

  it("has nothing to listen to for following, or without a campus", () => {
    expect(liveFeedRoom("following", "unilag")).toBeNull()
    expect(liveFeedRoom("campus", null)).toBeNull()
  })
})
