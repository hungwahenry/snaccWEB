import { describe, expect, it } from "vitest"
import type { AnnouncementAudience, AudienceDraft } from "../types"
import {
  audienceDraftFrom,
  audienceErrors,
  audienceSummary,
  isAudienceValid,
  pickPlatforms,
  toAudienceInput,
} from "./audience"

const everyone: AnnouncementAudience = {
  campus_ids: [],
  platforms: [],
  min_version: null,
  max_version: null,
  premium: "any",
  joined_within_days: null,
  quiet_for_days: null,
}

const acronyms = new Map([
  ["c1", "UNILAG"],
  ["c2", "LASU"],
])

describe("audienceSummary", () => {
  it("says everyone when nothing narrows it", () => {
    expect(audienceSummary(everyone, acronyms)).toBe("Everyone")
  })

  it("reads every filter in plain words", () => {
    expect(
      audienceSummary(
        {
          campus_ids: ["c1", "c2"],
          platforms: ["ios"],
          min_version: "1.4.0",
          max_version: null,
          premium: "premium",
          joined_within_days: 7,
          quiet_for_days: 14,
        },
        acronyms
      )
    ).toBe(
      "UNILAG, LASU · iPhone · app 1.4.0+ · Premium only · joined in the last 7 days · quiet 14+ days"
    )
  })

  it("capitalises whatever comes first", () => {
    expect(
      audienceSummary(
        { ...everyone, max_version: "1.5.0", premium: "free" },
        acronyms
      )
    ).toBe("App up to 1.5.0 · Not Premium")
    expect(
      audienceSummary(
        { ...everyone, joined_within_days: 1, quiet_for_days: 1 },
        acronyms
      )
    ).toBe("Joined in the last day · quiet 1+ day")
  })

  it("counts campuses it cannot name", () => {
    expect(
      audienceSummary({ ...everyone, campus_ids: ["x", "y"] }, acronyms)
    ).toBe("2 campuses")
    expect(
      audienceSummary({ ...everyone, campus_ids: ["c1", "x"] }, acronyms)
    ).toBe("UNILAG +1")
  })

  it("lists platforms in a steady order", () => {
    expect(
      audienceSummary({ ...everyone, platforms: ["web", "ios"] }, acronyms)
    ).toBe("iPhone, Web")
  })
})

describe("pickPlatforms", () => {
  it("keeps known platforms in order and drops anything else", () => {
    expect(pickPlatforms(["web", "nope", "android"])).toEqual([
      "android",
      "web",
    ])
  })
})

describe("audience drafts", () => {
  const draft = (patch: Partial<AudienceDraft> = {}): AudienceDraft => ({
    ...audienceDraftFrom(),
    ...patch,
  })

  it("starts from everyone, or from what is saved", () => {
    expect(audienceDraftFrom()).toEqual({
      campusIds: [],
      platforms: [],
      minVersion: "",
      maxVersion: "",
      premium: "any",
      joinedWithinDays: "",
      quietForDays: "",
    })
    expect(
      audienceDraftFrom({ ...everyone, joined_within_days: 7 }).joinedWithinDays
    ).toBe("7")
  })

  it("refuses bad versions and day counts", () => {
    expect(isAudienceValid(draft())).toBe(true)
    expect(
      audienceErrors(draft({ minVersion: "v1" })).minVersion
    ).not.toBeNull()
    expect(
      audienceErrors(draft({ minVersion: "1.5.0", maxVersion: "1.4.0" }))
        .maxVersion
    ).not.toBeNull()
    expect(
      audienceErrors(draft({ joinedWithinDays: "0" })).joinedWithinDays
    ).not.toBeNull()
    expect(
      audienceErrors(draft({ quietForDays: "366" })).quietForDays
    ).not.toBeNull()
    expect(isAudienceValid(draft({ quietForDays: "2.5" }))).toBe(false)
  })

  it("sends blanks as no limit", () => {
    expect(
      toAudienceInput(
        draft({
          campusIds: ["c1"],
          platforms: ["web", "ios"],
          minVersion: " 1.4.0 ",
          premium: "free",
          quietForDays: " 14 ",
        })
      )
    ).toEqual({
      campusIds: ["c1"],
      platforms: ["ios", "web"],
      minVersion: "1.4.0",
      maxVersion: null,
      premium: "free",
      joinedWithinDays: null,
      quietForDays: 14,
    })
  })
})
