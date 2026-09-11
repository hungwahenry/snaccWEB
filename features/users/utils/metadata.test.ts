import { describe, expect, it } from "vitest"
import type { PublicProfile } from "../types"
import { profileCta, profileMetadata } from "./metadata"

const ada = {
  id: "u1",
  username: "ada",
  display_name: "Ada",
  avatar_url: "https://cdn/ada.png",
  bio: null,
  university: { acronym: "UNILAG" },
} as PublicProfile

describe("profileMetadata", () => {
  it("says so when there is no such profile", () => {
    expect(profileMetadata(null)).toEqual({ title: "Profile not found" })
  })

  it("titles the page by name and handle, without the site suffix twice", () => {
    const metadata = profileMetadata(ada)
    expect(metadata.title).toEqual({ absolute: "Ada (@ada) on Snacc" })
    expect(metadata.description).toBe("Ada is on Snacc. UNILAG.")
    expect(metadata.alternates?.canonical).toBe("/@ada")
    expect(metadata.openGraph?.url).toBe("/@ada")
  })

  it("uses the bio when there is one", () => {
    expect(profileMetadata({ ...ada, bio: "  hi there " }).description).toBe(
      "hi there"
    )
  })
})

describe("profileCta", () => {
  it("falls back to the handle when there is no display name", () => {
    expect(profileCta(ada)).toBe("See everything Ada posts")
    expect(profileCta({ ...ada, display_name: null })).toBe(
      "See everything ada posts"
    )
  })
})
