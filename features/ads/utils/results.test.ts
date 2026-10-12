import { describe, expect, it } from "vitest"
import { everyDay } from "./results"

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
