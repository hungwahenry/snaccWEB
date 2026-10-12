import { describe, expect, it } from "vitest"
import type { Snacc } from "@/features/snaccs/types"
import type { Campaign, CampaignAudience } from "../types"
import {
  audienceLines,
  budgetLeftLine,
  campaignHeadline,
  campaignStatus,
  campaignThumb,
  canPause,
  canPromoteAgain,
  canResume,
  extendBounds,
  isOpen,
  placementsLine,
  spendLine,
  spentPercent,
  statusNote,
  TARGET_GENDERS,
} from "./campaigns"

const NOW = Date.parse("2026-10-12T09:00:00.000Z")
const LATER = "2026-10-14T09:00:00.000Z"
const EARLIER = "2026-10-10T09:00:00.000Z"

const status = (patch: Partial<Campaign>) => ({
  status: "active" as const,
  paused_by: null,
  end_reason: null,
  starts_at: EARLIER,
  ends_at: LATER,
  ended_at: null,
  ...patch,
})

const nobody: CampaignAudience = {
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

const snacc = (patch: Partial<Snacc> = {}) =>
  ({
    body: null,
    spoiler: false,
    images: [],
    gif: null,
    sticker: null,
    voice: null,
    clip: null,
    poll: null,
    resnacc_of: null,
    ...patch,
  }) as Snacc

describe("campaignStatus", () => {
  it("tells a scheduled promotion from a running one", () => {
    expect(campaignStatus(status({}), NOW)).toEqual({
      label: "Running",
      tone: "good",
    })
    expect(campaignStatus(status({ starts_at: LATER }), NOW).label).toBe(
      "Scheduled"
    )
  })

  it("says why one ended", () => {
    expect(
      campaignStatus(status({ status: "ended", end_reason: "spent" }), NOW)
        .label
    ).toBe("Budget spent")
    expect(
      campaignStatus(status({ status: "ended", end_reason: "cancelled" }), NOW)
        .label
    ).toBe("Stopped")
    expect(campaignStatus(status({ status: "rejected" }), NOW)).toEqual({
      label: "Not approved",
      tone: "bad",
    })
    expect(campaignStatus(status({ status: "pending" }), NOW).label).toBe(
      "In review"
    )
  })

  it("explains each state in a line", () => {
    expect(statusNote(status({ status: "pending" }), NOW)).toMatch(/checking/)
    expect(statusNote(status({ status: "rejected" }), NOW)).toMatch(
      /went back to your wallet/
    )
    expect(statusNote(status({ starts_at: LATER }), NOW)).toMatch(
      /^Approved\. It starts/
    )
  })

  it("can be stopped only while it is open", () => {
    expect(isOpen({ status: "pending" })).toBe(true)
    expect(isOpen({ status: "paused" })).toBe(true)
    expect(isOpen({ status: "ended" })).toBe(false)
    expect(isOpen({ status: "rejected" })).toBe(false)
  })

  it("pauses only while running, and resumes only its own pause", () => {
    expect(canPause({ status: "active" })).toBe(true)
    expect(canPause({ status: "pending" })).toBe(false)
    expect(canResume({ status: "paused", paused_by: "advertiser" })).toBe(true)
    expect(canResume({ status: "paused", paused_by: "admin" })).toBe(false)
  })

  it("says when Snacc paused it", () => {
    const held = status({ status: "paused", paused_by: "admin" })
    expect(campaignStatus(held, NOW).label).toBe("Paused by Snacc")
    expect(statusNote(held, NOW)).toMatch(/only Snacc can start it again/)
    expect(
      campaignStatus(status({ status: "paused", paused_by: "advertiser" }), NOW)
        .label
    ).toBe("Paused")
  })

  it("offers promoting again once it is over", () => {
    expect(canPromoteAgain({ status: "ended" })).toBe(true)
    expect(canPromoteAgain({ status: "rejected" })).toBe(true)
    expect(canPromoteAgain({ status: "active" })).toBe(false)
  })
})

describe("campaign copy", () => {
  it("counts spend against the budget", () => {
    expect(spendLine({ spent_kobo: 120_000, budget_kobo: 500_000 })).toBe(
      "₦1,200 of ₦5,000 spent"
    )
    expect(spentPercent({ spent_kobo: 120_000, budget_kobo: 500_000 })).toBe(24)
    expect(spentPercent({ spent_kobo: 9, budget_kobo: 0 })).toBe(0)
    expect(budgetLeftLine({ spent_kobo: 120_000, budget_kobo: 500_000 })).toBe(
      "₦3,800 left"
    )
  })

  it("names the snacc by its words, else by what it carries", () => {
    expect(campaignHeadline(snacc({ body: "  big sale  " }))).toBe("big sale")
    expect(
      campaignHeadline(snacc({ clip: { status: "ready" } as Snacc["clip"] }))
    ).toBe("Clip")
    expect(campaignHeadline(snacc())).toBe("Snacc")
  })

  it("never shows a thumbnail of something marked sensitive", () => {
    const images = [
      {
        id: "i",
        url: "https://cdn/i.jpg",
        thumb_url: "https://cdn/i-t.jpg",
        width: 1,
        height: 1,
        position: 0,
      },
    ]
    expect(campaignThumb(snacc({ images }))).toBe("https://cdn/i-t.jpg")
    expect(campaignThumb(snacc({ images, spoiler: true }))).toBeNull()
  })

  it("never offers prefer-not-to-say as a gender to aim at", () => {
    expect(TARGET_GENDERS.map((option) => option.value)).toEqual([
      "male",
      "female",
      "non_binary",
    ])
  })

  it("lists the places it shows", () => {
    expect(placementsLine(["feed", "lists"])).toBe(
      "Home feed, Campus, tags and search"
    )
  })
})

describe("audienceLines", () => {
  it("says everyone when nothing narrows it", () => {
    expect(audienceLines(nobody)).toEqual(["Everyone on Snacc"])
  })

  it("spells out each choice", () => {
    expect(
      audienceLines({
        ...nobody,
        campuses: [{ id: "c", name: "University of Lagos", acronym: "UNILAG" }],
        states: ["lagos", "fct"],
        ownerships: ["federal"],
        genders: ["female"],
        graduation_from: 2020,
        graduation_to: 2024,
        standing: "graduates",
        platforms: ["ios", "web"],
        joined_within_days: 30,
        hashtags: ["afrobeats"],
      })
    ).toEqual([
      "Campuses: UNILAG",
      "States: Lagos, FCT (Abuja)",
      "School type: Federal",
      "Gender: Female",
      "Class of 2020–2024",
      "Graduates only",
      "On iPhone, Web",
      "Joined in the last 30 days",
      "Into #afrobeats",
    ])
  })

  it("reads an open-ended graduation range", () => {
    expect(audienceLines({ ...nobody, graduation_from: 2022 })).toEqual([
      "Class of 2022 or later",
    ])
  })
})

describe("extendBounds", () => {
  it("starts after the current end and stops at the longest run", () => {
    const bounds = extendBounds({ starts_at: EARLIER, ends_at: LATER }, NOW, 30)
    expect(bounds.min.getTime()).toBe(Date.parse(LATER) + 5 * 60_000)
    expect(bounds.max.getTime()).toBe(Date.parse(EARLIER) + 30 * 86_400_000)
  })
})
