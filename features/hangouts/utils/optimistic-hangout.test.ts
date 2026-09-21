import { describe, expect, it } from "vitest"
import { optimisticHangout } from "./optimistic-hangout"

describe("optimisticHangout", () => {
  it("shows the host as the one person going until the server answers", () => {
    expect(
      optimisticHangout(
        {
          title: "watch the derby",
          emoji: "⚽",
          place: "SUB",
          startsAt: "2026-10-03T18:00:00.000Z",
          capacity: 6,
          private: true,
        },
        "ui"
      )
    ).toMatchObject({
      going_count: 1,
      full: false,
      join_state: "going",
      private: true,
      university_id: "ui",
    })
  })
})
