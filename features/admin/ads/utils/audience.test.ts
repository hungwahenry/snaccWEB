import { describe, expect, it } from "vitest"
import type { AdAudience } from "../types"
import {
  audienceFacts,
  graduationLine,
  joinedLine,
  placementsLine,
} from "./audience"

const open: AdAudience = {
  country: { code: "KE", name: "Kenya" },
  campuses: [],
  regions: [],
  campus_types: [],
  genders: [],
  graduation_from: null,
  graduation_to: null,
  standing: "any",
  platforms: [],
  joined_within_days: null,
  hashtags: [],
}

describe("audienceFacts", () => {
  it("says when nothing narrows the audience", () => {
    expect(audienceFacts(open).map((fact) => fact.value)).toEqual([
      "Kenya",
      "Any campus",
      "Anywhere in the country",
      "Any",
      "Anyone",
      "Any year",
      "Students and graduates",
      "Every platform",
      "Any time",
      "Anything",
    ])
  })

  it("names every choice that narrows it", () => {
    expect(
      audienceFacts({
        country: { code: "KE", name: "Kenya" },
        campuses: [
          { id: "u1", name: "University of Nairobi", acronym: "UON" },
          { id: "u2", name: "Strathmore University", acronym: "SU" },
        ],
        regions: [
          { id: "r1", name: "Nairobi" },
          { id: "r2", name: "Mombasa" },
        ],
        campus_types: [
          { id: "t1", name: "Public" },
          { id: "t2", name: "Private" },
        ],
        genders: ["female", "non_binary"],
        graduation_from: 2025,
        graduation_to: 2027,
        standing: "students",
        platforms: ["ios", "web"],
        joined_within_days: 30,
        hashtags: ["afrobeats", "jollof"],
      }).map((fact) => [fact.label, fact.value])
    ).toEqual([
      ["Country", "Kenya"],
      ["Campuses", "UON, SU"],
      ["Regions", "Nairobi, Mombasa"],
      ["Campus types", "Public, Private"],
      ["Gender", "Women, Non-binary"],
      ["Graduation year", "2025–2027"],
      ["Students or graduates", "Students only"],
      ["Platforms", "iPhone, Web"],
      ["Joined", "In the last 30 days"],
      ["Interested in", "#afrobeats, #jollof"],
    ])
  })
})

describe("graduationLine", () => {
  it("reads a range, an open end or a single year", () => {
    expect(graduationLine(2025, 2027)).toBe("2025–2027")
    expect(graduationLine(2026, 2026)).toBe("2026")
    expect(graduationLine(2025, null)).toBe("2025 or later")
    expect(graduationLine(null, 2027)).toBe("2027 or earlier")
  })
})

describe("joinedLine", () => {
  it("handles a single day", () => {
    expect(joinedLine(1)).toBe("In the last day")
  })
})

describe("placementsLine", () => {
  it("names each place it shows", () => {
    expect(placementsLine(["feed", "lists"])).toBe(
      "Home feed, Campus, hashtag and search lists"
    )
  })
})
