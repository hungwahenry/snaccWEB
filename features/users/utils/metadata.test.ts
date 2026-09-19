import { describe, expect, it } from "vitest"
import type { PublicProfile } from "../types"
import { profileCta, profileJsonLd, profileMetadata } from "./metadata"

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

describe("private profiles", () => {
  it("asks search engines to leave a private profile out", () => {
    expect(profileMetadata({ ...ada, is_private: true }).robots).toEqual({
      index: false,
      follow: false,
    })
    expect(profileMetadata(ada).robots).toBeUndefined()
  })

  it("describes nobody who chose to be private", () => {
    expect(profileJsonLd({ ...ada, is_private: true })).toBeNull()
  })
})

describe("profileJsonLd", () => {
  it("describes the person, where they study and how many follow them", () => {
    const data = profileJsonLd({
      ...ada,
      followers_count: 12,
      snaccs_count: 30,
      university: { acronym: "UNILAG", name: "University of Lagos" },
    } as PublicProfile)

    expect(data).toMatchObject({
      "@type": "ProfilePage",
      url: "https://snacc.fyi/@ada",
      mainEntity: {
        "@type": "Person",
        name: "Ada",
        alternateName: "@ada",
        affiliation: { name: "University of Lagos" },
      },
    })
  })
})
