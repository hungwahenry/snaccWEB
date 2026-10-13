import { describe, expect, it } from "vitest"
import type { AdminLegalSummary } from "../types"
import { standingOf } from "./legal"

const doc = (
  id: string,
  version: number,
  published: boolean,
  country_code: string | null = null
): AdminLegalSummary => ({
  id,
  kind: "terms",
  country_code,
  version,
  title: "Terms of Use",
  published_at: published ? "2026-10-13T12:00:00.000Z" : null,
  updated_at: "2026-10-13T12:00:00.000Z",
  accepted_count: 0,
})

describe("standingOf", () => {
  const all = [
    doc("v1", 1, true),
    doc("v2", 2, true),
    doc("v3", 3, false),
    doc("gh1", 1, true, "GH"),
  ]

  it("tells a draft, the version in force and the ones it replaced apart", () => {
    expect(standingOf(all[2], all)).toBe("draft")
    expect(standingOf(all[1], all)).toBe("in_force")
    expect(standingOf(all[0], all)).toBe("replaced")
  })

  it("keeps each country's versions to themselves", () => {
    expect(standingOf(all[3], all)).toBe("in_force")
  })
})
