import { describe, expect, it } from "vitest"
import type { University } from "@/features/universities/types"
import { isGender } from "./gender"
import {
  avatarLabel,
  classOf,
  handleWithCampus,
  notifyLabel,
  profileMeta,
  profileStats,
} from "./profile"
import { profileEmpty, profileTab } from "./profile-tabs"

const base = {
  university: null,
  graduated: false,
  graduation_year: null,
  major: null,
}

describe("profile copy", () => {
  it("names the class only once someone has graduated", () => {
    expect(classOf({ graduated: false, graduation_year: 2024 })).toBeNull()
    expect(classOf({ graduated: true, graduation_year: 2024 })).toBe(
      "🎓 Class of 2024"
    )
    expect(classOf({ graduated: true, graduation_year: null })).toBe(
      "🎓 Alumni"
    )
  })

  it("joins whatever meta there is and says nothing when there is none", () => {
    expect(profileMeta(base)).toBeNull()
    expect(
      profileMeta({
        ...base,
        university: { acronym: "UNILAG" } as University,
        graduated: true,
        graduation_year: 2020,
        major: "Law",
      })
    ).toBe("UNILAG · 🎓 Class of 2020 · Law")
  })

  it("says what the bell and the picture do", () => {
    expect(notifyLabel(true)).toBe("Stop notifying me of their posts")
    expect(notifyLabel(false)).toBe("Notify me when they post")
    const ada = { display_name: "Ada", username: "ada" }
    expect(avatarLabel(ada, true)).toBe("Ada’s moments")
    expect(avatarLabel({ display_name: null, username: "ada" }, false)).toBe(
      "ada’s profile photo"
    )
  })

  it("lists the four counts, linking only the ones given a link", () => {
    const stats = profileStats(
      {
        snaccs_count: 3,
        total_views_received: 1200,
        following_count: 4,
        followers_count: 5,
      },
      { following: "/f?tab=following", followers: "/f?tab=followers" }
    )
    expect(stats.map((stat) => stat.label)).toEqual([
      "Snaccs",
      "Views",
      "Following",
      "Followers",
    ])
    expect(stats[0].href).toBeUndefined()
    expect(stats[3]).toEqual({
      label: "Followers",
      count: 5,
      href: "/f?tab=followers",
    })
  })
})

describe("handleWithCampus", () => {
  it("joins the handle and campus, or shows whichever there is", () => {
    const unilag = { acronym: "UNILAG" }
    expect(handleWithCampus({ username: "ada", university: unilag })).toBe(
      "@ada · UNILAG"
    )
    expect(handleWithCampus({ username: "ada", university: null })).toBe("@ada")
    expect(handleWithCampus({ username: null, university: unilag })).toBe(
      "UNILAG"
    )
  })
})

describe("profile tabs", () => {
  it("finds a tab and falls back to the first", () => {
    expect(profileTab("media").label).toBe("Media")
  })

  it("words an empty tab for you and for someone else", () => {
    expect(profileEmpty("snaccs", true)).toEqual({
      title: "No snaccs yet",
      description: "What you post shows up here.",
    })
    expect(profileEmpty("replies", false).description).toMatch(/they reply/)
  })
})

describe("isGender", () => {
  it("accepts only the genders on offer", () => {
    expect(isGender("female")).toBe(true)
    expect(isGender("other")).toBe(false)
  })
})
