import { describe, expect, it } from "vitest"
import type { Snacc } from "../types"
import { deleteWarning } from "./delete-warning"

const NOW = Date.parse("2026-10-03T12:00:00.000Z")

const hangout = (patch: Partial<NonNullable<Snacc["hangout"]>> = {}) =>
  ({
    state: "upcoming",
    starts_at: "2026-10-03T18:00:00.000Z",
    wraps_at: "2026-10-04T18:00:00.000Z",
    ...patch,
  }) as NonNullable<Snacc["hangout"]>

describe("deleteWarning", () => {
  it("warns that replies go with it", () => {
    expect(deleteWarning({ comments_count: 2, hangout: null }, NOW)).toBe(
      "Its replies go with it. This cannot be undone."
    )
    expect(deleteWarning({ comments_count: 0, hangout: null }, NOW)).toBe(
      "This cannot be undone."
    )
  })

  it("warns that a hangout still on gets called off, and not one already over", () => {
    expect(deleteWarning({ comments_count: 0, hangout: hangout() }, NOW)).toBe(
      "This calls off the hangout and tells everyone going. This cannot be undone."
    )
    expect(
      deleteWarning(
        {
          comments_count: 0,
          hangout: hangout({
            starts_at: "2026-10-01T18:00:00.000Z",
            wraps_at: "2026-10-02T18:00:00.000Z",
          }),
        },
        NOW
      )
    ).toBe("This cannot be undone.")
  })
})
