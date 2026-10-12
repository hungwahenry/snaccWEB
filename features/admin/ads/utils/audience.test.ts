import { describe, expect, it } from "vitest"
import type { AdAudience } from "../types"
import {
  audienceFacts,
  graduationLine,
  joinedLine,
  placementsLine,
} from "./audience"

const open: AdAudience = {
  campuses: [],
  states: [],
  ownerships: [],
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
      "Any campus",
      "Anywhere",
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
        campuses: [
          { id: "u1", name: "University of Lagos", acronym: "UNILAG" },
          { id: "u2", name: "Covenant University", acronym: "CU" },
        ],
        states: ["lagos", "akwa_ibom", "fct"],
        ownerships: ["federal", "private"],
        genders: ["female", "non_binary"],
        graduation_from: 2025,
        graduation_to: 2027,
        standing: "students",
        platforms: ["ios", "web"],
        joined_within_days: 30,
        hashtags: ["afrobeats", "jollof"],
      }).map((fact) => [fact.label, fact.value])
    ).toEqual([
      ["Campuses", "UNILAG, CU"],
      ["States", "Lagos, Akwa Ibom, FCT (Abuja)"],
      ["School types", "Federal, Private"],
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
