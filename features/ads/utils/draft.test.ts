import type { CountryPlaces } from "@/features/places/types"
import { describe, expect, it } from "vitest"
import { ApiError } from "@/lib/api/errors"
import { DAY_MS, HOUR_MS } from "@/lib/duration"
import type { Campaign, CampaignDraft, DraftLimits } from "../types"
import {
  addHashtag,
  campaignInput,
  draftFromCampaign,
  draftProblems,
  HASHTAGS_MAX,
  isReady,
  newDraft,
  placementChoices,
  reachProblem,
  reviewRows,
  scheduleBounds,
  submitProblem,
  toggleIn,
  topUpProblem,
  wholeNaira,
} from "./draft"

const NOW = Date.parse("2026-10-12T09:00:00.000Z")

const limits: DraftLimits = {
  now: NOW,
  minBudgetKobo: 200_000,
  maxDays: 30,
  maxLeadDays: 30,
  balanceKobo: 1_000_000,
}

const KENYA: CountryPlaces = {
  code: "KE",
  name: "Kenya",
  currency: "KES",
  open: true,
  regions: [
    { id: "01NAIROBI", parent_id: null, slug: "nairobi", name: "Nairobi" },
  ],
  campus_types: [{ id: "01PUBLIC", slug: "public", name: "Public" }],
}

const draft = (patch: Partial<CampaignDraft> = {}): CampaignDraft => ({
  ...newDraft(NOW, false, 30, "KE"),
  budget: "5000",
  ...patch,
})

describe("newDraft", () => {
  it("shows a clip everywhere and anything else everywhere but Clips", () => {
    expect(newDraft(NOW, true, 30, "KE").placements).toEqual([
      "feed",
      "clips",
      "discover",
      "lists",
    ])
    expect(newDraft(NOW, false, 30, "KE").placements).toEqual([
      "feed",
      "discover",
      "lists",
    ])
    expect(placementChoices(false).map((choice) => choice.value)).not.toContain(
      "clips"
    )
  })

  it("starts right away and runs a week, or less when that is the most allowed", () => {
    const week = newDraft(NOW, false, 30, "KE")
    expect(week.startsAt).toBeNull()
    expect(Date.parse(week.endsAt) - NOW).toBe(7 * DAY_MS)
    expect(Date.parse(newDraft(NOW, false, 3, "KE").endsAt) - NOW).toBe(
      3 * DAY_MS
    )
  })
})

describe("small edits", () => {
  it("toggles a value in and out of a list", () => {
    expect(toggleIn(["a"], "b")).toEqual(["a", "b"])
    expect(toggleIn(["a", "b"], "a")).toEqual(["b"])
  })

  it("keeps whole naira only", () => {
    expect(wholeNaira("₦5,000")).toBe("5000")
    expect(wholeNaira("0050")).toBe("50")
    expect(wholeNaira("12.50")).toBe("1250")
  })

  it("adds a tag once, without the #, up to the limit", () => {
    expect(addHashtag([], " #Lagos ")).toEqual(["lagos"])
    expect(addHashtag(["lagos"], "LAGOS")).toEqual(["lagos"])
    expect(addHashtag([], "two words")).toEqual([])
    expect(addHashtag([], "#")).toEqual([])
    const full = Array.from({ length: HASHTAGS_MAX }, (_, i) => `t${i}`)
    expect(addHashtag(full, "more")).toBe(full)
  })
})

describe("campaignInput", () => {
  it("sends kobo, a start of now when none was picked, and the audience as ids", () => {
    const input = campaignInput(
      "01SNACC",
      draft({
        budget: "2500",
        campuses: [
          { id: "01CAMPUS", name: "University of Nairobi", acronym: "UON" },
        ],
        regionIds: ["01NAIROBI"],
        buttonId: "01BUTTON00000000000000000A",
        buttonUrl: " https://shop.example/x ",
      }),
      NOW
    )

    expect(input.snaccId).toBe("01SNACC")
    expect(input.budgetKobo).toBe(250_000)
    expect(input.startsAt).toBe(new Date(NOW).toISOString())
    expect(input.buttonId).toBe("01BUTTON00000000000000000A")
    expect(input.buttonUrl).toBe("https://shop.example/x")
    expect(input.audience.campusIds).toEqual(["01CAMPUS"])
    expect(input.audience.countryCode).toBe("KE")
    expect(input.audience.regionIds).toEqual(["01NAIROBI"])
    expect(input.audience.standing).toBe("any")
  })

  it("sends no link when the button is left off", () => {
    expect(campaignInput("01SNACC", draft(), NOW).buttonUrl).toBeNull()
  })
})

describe("draftProblems", () => {
  it("has none for a sound draft", () => {
    const sound = draft()
    expect(draftProblems(sound, limits)).toEqual({})
    expect(isReady(sound, {})).toBe(true)
  })

  it("is not ready before there is a budget, without calling that a problem", () => {
    const empty = draft({ budget: "" })
    expect(draftProblems(empty, limits)).toEqual({})
    expect(isReady(empty, {})).toBe(false)
  })

  it("wants the button and its link together, and the link on https", () => {
    expect(
      draftProblems(draft({ buttonId: "01BUTTON00000000000000000A" }), limits)
        .button
    ).toBe("Add the link the button opens.")
    expect(
      draftProblems(draft({ buttonUrl: "https://a.example" }), limits).button
    ).toBe("Pick what the button says, or clear the link.")
    expect(
      draftProblems(
        draft({
          buttonId: "01BUTTON00000000000000000A",
          buttonUrl: "http://a.example",
        }),
        limits
      ).button
    ).toBe("Use a full link that starts with https://")
  })

  it("checks the run: not in the past, end after start, not too long", () => {
    expect(
      draftProblems(
        draft({ startsAt: new Date(NOW - HOUR_MS).toISOString() }),
        limits
      ).schedule
    ).toBe("Pick a start time from now on.")
    expect(
      draftProblems(draft({ endsAt: new Date(NOW).toISOString() }), limits)
        .schedule
    ).toBe("The end has to come after the start.")
    expect(
      draftProblems(
        draft({ endsAt: new Date(NOW + 31 * DAY_MS).toISOString() }),
        limits
      ).schedule
    ).toBe("A promotion can run for up to 30 days.")
  })

  it("checks the budget against the minimum and the balance", () => {
    expect(draftProblems(draft({ budget: "1000" }), limits).budget).toBe(
      "The smallest budget is ₦2,000."
    )
    expect(draftProblems(draft({ budget: "20000" }), limits).budget).toBe(
      "That's more than your Snacc balance of ₦10,000."
    )
    expect(
      draftProblems(draft({ budget: "20000" }), {
        ...limits,
        balanceKobo: null,
      }).budget
    ).toBeUndefined()
  })

  it("catches graduation years the wrong way round and no placements", () => {
    const problems = draftProblems(
      draft({ graduationFrom: 2024, graduationTo: 2020, placements: [] }),
      limits
    )
    expect(problems.audience).toBe(
      "The graduation years are the wrong way round."
    )
    expect(problems.placements).toBe("Pick at least one place to show it.")
  })
})

describe("scheduleBounds", () => {
  it("lets the end run up to the most days after the start", () => {
    const start = new Date(NOW + DAY_MS).toISOString()
    const bounds = scheduleBounds("end", start, NOW, limits)
    expect(bounds.max.getTime()).toBe(NOW + 31 * DAY_MS)
    expect(bounds.min.getTime()).toBeGreaterThan(NOW + DAY_MS)
  })

  it("starts the start from now", () => {
    expect(
      scheduleBounds("start", null, NOW, limits).min.getTime()
    ).toBeGreaterThan(NOW)
    expect(scheduleBounds("start", null, NOW, limits).max.getTime()).toBe(
      NOW + 30 * DAY_MS
    )
  })

  it("refuses a start further ahead than allowed", () => {
    const late = new Date(NOW + 31 * DAY_MS).toISOString()
    const end = new Date(NOW + 32 * DAY_MS).toISOString()
    expect(
      draftProblems(draft({ startsAt: late, endsAt: end }), limits).schedule
    ).toBe("A promotion can start up to 30 days from now.")
  })
})

describe("submitProblem", () => {
  it("puts each refusal next to what caused it", () => {
    expect(
      submitProblem(
        new ApiError(422, "Too small", "budget_too_small", {
          minimum_kobo: 300_000,
        } as unknown as Record<string, string[]>)
      )
    ).toEqual({ field: "budget", message: "The smallest budget is ₦3,000." })
    expect(
      submitProblem(new ApiError(422, "Aim wider.", "audience_too_small"))
    ).toEqual({ field: "audience", message: "Aim wider." })
    expect(
      submitProblem(new ApiError(422, "Not yours.", "not_promotable"))
    ).toEqual({ field: "general", message: "Not yours." })
    expect(
      submitProblem(new ApiError(400, "Not enough.", "insufficient_funds"))
    ).toEqual({ field: "budget", message: "Not enough." })
  })

  it("leaves anything else to the usual error toast", () => {
    expect(submitProblem(new ApiError(500, "Oops"))).toBeNull()
    expect(submitProblem(new Error("x"))).toBeNull()
  })
})

describe("reachProblem", () => {
  it("shows an unknown tag from the live estimate", () => {
    expect(
      reachProblem(
        new ApiError(422, "Nobody has used #zz yet.", "unknown_hashtag"),
        undefined,
        100
      )
    ).toBe("Nobody has used #zz yet.")
    expect(reachProblem(new ApiError(500, "Oops"), undefined, 100)).toBeNull()
  })

  it("asks for a wider audience below the smallest allowed", () => {
    expect(reachProblem(null, 40, 100)).toBe(
      "Aim it at at least 100 people. Widen who it reaches."
    )
    expect(reachProblem(null, 100, 100)).toBeNull()
    expect(reachProblem(null, undefined, 100)).toBeNull()
  })
})

describe("reviewRows", () => {
  it("sums up the draft the way a promotion's page does", () => {
    const rows = reviewRows({
      draft: draft({
        regionIds: ["01NAIROBI"],
        campusTypeIds: ["01PUBLIC"],
        placements: ["feed"],
        buttonId: "01BUTTON00000000000000000A",
        buttonUrl: " https://shop.example ",
        budget: "5000",
      }),
      places: KENYA,
      buttonLabel: "Shop now",
      start: "Right away",
      end: "Mon 19 Oct, 9:00",
      estimate: null,
    })

    expect(rows.map((row) => row.label)).toEqual([
      "Who sees it",
      "Where it shows",
      "Button",
      "When it runs",
      "Budget",
    ])
    expect(rows[0].lines).toEqual([
      "In Kenya",
      "Regions: Nairobi",
      "Campus type: Public",
    ])
    expect(rows[2].lines).toEqual(["Shop now", "https://shop.example"])
    expect(rows[3].lines).toEqual([
      "Starts Right away",
      "Ends Mon 19 Oct, 9:00",
    ])
    expect(rows[4].lines).toEqual(["₦5,000"])
  })

  it("says there is no button when none was picked", () => {
    const rows = reviewRows({
      draft: draft(),
      places: KENYA,
      buttonLabel: null,
      start: "Right away",
      end: "later",
      estimate: null,
    })
    expect(rows[2].lines).toEqual(["No button"])
  })
})

describe("topUpProblem", () => {
  const money = { minBudgetKobo: 200_000, balanceKobo: 500_000 }

  it("waits for an amount, then checks the floor and the balance", () => {
    expect(topUpProblem("", money)).toBeNull()
    expect(topUpProblem("500", money)).toBe("Add at least ₦2,000.")
    expect(topUpProblem("6000", money)).toBe(
      "That's more than your Snacc balance of ₦5,000."
    )
    expect(topUpProblem("3000", money)).toBeNull()
  })
})

describe("draftFromCampaign", () => {
  it("copies the setup and starts a fresh run of the same length", () => {
    const source = {
      starts_at: "2026-10-01T09:00:00.000Z",
      ends_at: "2026-10-04T09:00:00.000Z",
      placements: ["feed", "clips"],
      button: {
        id: "01BUTTON00000000000000000A",
        label: "Shop now",
        url: "https://a.example",
      },
      budget_kobo: 500_000,
      audience: {
        country: { code: "KE", name: "Kenya" },
        campuses: [],
        regions: [{ id: "01NAIROBI", name: "Nairobi" }],
        campus_types: [],
        genders: ["female"],
        graduation_from: 2027,
        graduation_to: null,
        standing: "students",
        platforms: [],
        joined_within_days: null,
        hashtags: ["unilag"],
      },
    } as unknown as Campaign
    const copy = draftFromCampaign(source, NOW, false, 30)

    expect(copy.countryCode).toBe("KE")
    expect(copy.regionIds).toEqual(["01NAIROBI"])
    expect(copy.genders).toEqual(["female"])
    expect(copy.graduationFrom).toBe(2027)
    expect(copy.standing).toBe("students")
    expect(copy.hashtags).toEqual(["unilag"])
    expect(copy.placements).toEqual(["feed"])
    expect(copy.buttonId).toBe("01BUTTON00000000000000000A")
    expect(copy.budget).toBe("5000")
    expect(copy.startsAt).toBeNull()
    expect(Date.parse(copy.endsAt)).toBeGreaterThanOrEqual(NOW + 3 * DAY_MS)
  })
})
