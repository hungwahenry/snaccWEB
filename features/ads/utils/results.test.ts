import { describe, expect, it } from "vitest"
import type { Campaign } from "../types"
import { everyDay, resultStats } from "./results"

describe("everyDay", () => {
  it("fills the quiet days between the first and the last", () => {
    const days = everyDay([
      { day: "2026-10-30", views: 4, clicks: 1, spent_kobo: 400 },
      { day: "2026-11-02", views: 2, clicks: 0, spent_kobo: 200 },
    ])

    expect(days.map((day) => day.day)).toEqual([
      "2026-10-30",
      "2026-10-31",
      "2026-11-01",
      "2026-11-02",
    ])
    expect(days[1]).toEqual({
      day: "2026-10-31",
      views: 0,
      clicks: 0,
      spent_kobo: 0,
    })
    expect(days[3].views).toBe(2)
  })

  it("is empty before anything has been seen", () => {
    expect(everyDay([])).toEqual([])
  })
})

describe("resultStats", () => {
  it("leaves out button taps when there is no button", () => {
    const labels = (button: Campaign["button"]) =>
      resultStats({ button }).map((stat) => stat.label)

    expect(labels(null)).not.toContain("Button taps")
    expect(
      labels({ id: "b1", label: "Shop now", url: "https://a.example" })
    ).toContain("Button taps")
  })
})
