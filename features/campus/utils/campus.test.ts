import { describe, expect, it } from "vitest"
import type { UniversityDetail } from "../types"
import { campusInitials, campusStats } from "./labels"
import { CAMPUS_CTA, campusMetadata } from "./metadata"

const unilag: UniversityDetail = {
  id: "c1",
  name: "University of Lagos",
  acronym: "unilag",
  slug: "unilag",
  motto: null,
  website: null,
  logo_url: null,
  members_count: 1234,
  snaccs_count: 1,
}

describe("campus labels", () => {
  it("uses the first two letters of the acronym", () => {
    expect(campusInitials(unilag)).toBe("UN")
  })

  it("counts students and snaccs with the right plurals", () => {
    expect(campusStats(unilag)).toBe("1.2k students · 1 snacc")
    expect(campusStats({ ...unilag, members_count: 1, snaccs_count: 5 })).toBe(
      "1 student · 5 snaccs"
    )
  })
})

describe("campusMetadata", () => {
  it("says so when there is no such campus", () => {
    expect(campusMetadata(null)).toEqual({ title: "Campus not found" })
  })

  it("titles the page by name without the site suffix twice", () => {
    const metadata = campusMetadata(unilag)
    expect(metadata.title).toEqual({ absolute: "University of Lagos on Snacc" })
    expect(metadata.description).toBe(
      "See what unilag is talking about on Snacc."
    )
    expect(metadata.alternates?.canonical).toBe("/campus/unilag")
    expect(metadata.openGraph?.url).toBe("/campus/unilag")
    expect(metadata.openGraph?.images).toBeUndefined()
  })

  it("leads with the motto and shows the logo when there is one", () => {
    const metadata = campusMetadata({
      ...unilag,
      motto: "In deed and in truth",
      logo_url: "https://cdn/logo.png",
    })
    expect(metadata.description).toBe(
      "In deed and in truth — 1.2k students on Snacc."
    )
    expect(metadata.openGraph?.images).toEqual(["https://cdn/logo.png"])
    expect(metadata.twitter?.images).toEqual(["https://cdn/logo.png"])
  })

  it("has a sign-up prompt", () => {
    expect(CAMPUS_CTA).toBeTruthy()
  })
})
