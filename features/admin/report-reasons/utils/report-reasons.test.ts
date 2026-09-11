import { describe, expect, it } from "vitest"
import type { AdminReportReason } from "../types"
import {
  draftFrom,
  isDraftReady,
  reasonStatus,
  toCreateInput,
  toUpdateInput,
} from "./report-reasons"

const reason = (patch: Partial<AdminReportReason> = {}): AdminReportReason => ({
  id: "r1",
  slug: "spam",
  label: "Spam",
  hint: null,
  applies_to: "snacc",
  requires_detail: false,
  position: 2,
  retired_at: null,
  created_at: "2026-01-01T00:00:00Z",
  ...patch,
})

describe("reasonStatus", () => {
  it("says whether a reason is still offered", () => {
    expect(reasonStatus(reason()).label).toBe("active")
    expect(reasonStatus(reason({ retired_at: "2026-02-01" })).label).toBe(
      "retired"
    )
  })
})

describe("drafts", () => {
  it("starts from the saved reason, or blank for a new one", () => {
    expect(draftFrom()).toMatchObject({
      slug: "",
      appliesTo: "snacc",
      position: "0",
    })
    expect(draftFrom(reason({ hint: "Ads" }))).toMatchObject({
      slug: "spam",
      hint: "Ads",
      position: "2",
    })
  })

  it("needs a slug only when creating", () => {
    const draft = { ...draftFrom(), label: "Spam" }
    expect(isDraftReady(draft, false)).toBe(false)
    expect(isDraftReady(draft, true)).toBe(true)
    expect(isDraftReady({ ...draft, slug: "spam" }, false)).toBe(true)
  })

  it("refuses a position that is not a whole number from 0 to 1000", () => {
    const draft = draftFrom(reason())
    expect(isDraftReady({ ...draft, position: "2.5" }, true)).toBe(false)
    expect(isDraftReady({ ...draft, position: "-1" }, true)).toBe(false)
    expect(isDraftReady({ ...draft, position: "1001" }, true)).toBe(false)
    expect(isDraftReady({ ...draft, position: "" }, true)).toBe(false)
    expect(isDraftReady({ ...draft, position: "1000" }, true)).toBe(true)
  })

  it("trims what was typed and drops an empty hint", () => {
    const draft = {
      ...draftFrom(),
      slug: " spam ",
      label: " Spam ",
      hint: "  ",
      position: "3",
    }
    expect(toCreateInput(draft)).toEqual({
      slug: "spam",
      label: "Spam",
      hint: undefined,
      appliesTo: "snacc",
      requiresDetail: false,
      position: 3,
    })
    expect(toUpdateInput(draft)).not.toHaveProperty("slug")
  })
})
