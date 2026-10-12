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
      { key: "a", avatarUrl: "a.png" },
    ])
  })

  it("skips events without a poster", () => {
    const posters = withNewPoster([], { actor_id: "a" })
    expect(withNewPoster(posters, {})).toBe(posters)
  })
})

describe("feed scopes", () => {
  it("leads with your country, always offers campus, and the rest only when switched on", () => {
    expect(
      feedTabs({ following: false, country: false }).map((tab) => tab.value)
    ).toEqual(["campus"])
    expect(
      feedTabs({ following: true, country: true }).map((tab) => tab.value)
    ).toEqual(["country", "campus", "following"])
  })

  it("only allows a feed that is switched on", () => {
    expect(scopeAllowed("country", { following: true, country: false })).toBe(
      false
    )
    expect(scopeAllowed("following", { following: true, country: false })).toBe(
      true
    )
    expect(scopeAllowed("campus", { following: false, country: false })).toBe(
      true
    )
  })

  it("has copy for every feed", () => {
    for (const scope of ["campus", "country", "following"] as const) {
      expect(FEED_EMPTY[scope].title).toBeTruthy()
      expect(FEED_FAILED[scope]).toBeTruthy()
    }
  })
})

describe("liveFeedRoom", () => {
  const unilag = { slug: "unilag", country_code: "NG" }

  it("listens to your campus or to your campus's country", () => {
    expect(liveFeedRoom("campus", unilag)).toBe(
      realtimeRooms.feedCampus("unilag")
    )
    expect(liveFeedRoom("country", unilag)).toBe(
      realtimeRooms.feedCountry("NG")
    )
  })

  it("has nothing to listen to for following, or without a campus", () => {
    expect(liveFeedRoom("following", unilag)).toBeNull()
    expect(liveFeedRoom("campus", null)).toBeNull()
  })
})
