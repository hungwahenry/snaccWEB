import { describe, expect, it } from "vitest"
import type { CategoryUsage, SurfaceSetting } from "../types"
import { moderationTotals, scoreSources } from "./moderation"

const category = (overrides: Partial<CategoryUsage> = {}): CategoryUsage => ({
  category: "harassment",
  label: "Harassment",
  description: "",
  scores_text: true,
  scores_image: true,
  scans: 0,
  ruled: ["comment"],
  unknown: false,
  ...overrides,
})

const surface = (enabled: boolean): SurfaceSetting => ({
  surface: "snacc",
  enabled,
  mode: "queued",
  timeout_ms: 800,
  updated_at: "2026-09-01T00:00:00Z",
})

describe("moderationTotals", () => {
  it("adds up reviews, what would be acted on, live surfaces and unused categories", () => {
    expect(
      moderationTotals(
        {
          today: 4,
          failures: 2,
          by_surface: [
            { surface: "snacc", verdict: "allow", count: 10 },
            { surface: "snacc", verdict: "flag", count: 3 },
            { surface: "comment", verdict: "block", count: 1 },
          ],
        },
        [surface(true), surface(false)],
        [category(), category({ category: "spam", ruled: [] })]
      )
    ).toEqual({
      reviewed: 14,
      today: 4,
      acted: 4,
      live: 1,
      surfaces: 2,
      failures: 2,
      unruled: 1,
    })
  })

  it("counts nothing while it all loads", () => {
    expect(moderationTotals(undefined)).toEqual({
      reviewed: 0,
      today: 0,
      acted: 0,
      live: 0,
      surfaces: 0,
      failures: 0,
      unruled: 0,
    })
  })
})

describe("scoreSources", () => {
  it("names text and images, or warns a category is text only", () => {
    expect(scoreSources(category()).map((source) => source.label)).toEqual([
      "text",
      "images",
    ])
    expect(scoreSources(category({ scores_image: false }))).toEqual([
      { label: "text", variant: "outline" },
      { label: "text only", variant: "secondary" },
    ])
  })

  it("marks a category the classifier only just started sending", () => {
    expect(
      scoreSources(category({ scores_text: false, unknown: true }))
    ).toEqual([
      { label: "images", variant: "outline" },
      { label: "new", variant: "default" },
    ])
  })
})
