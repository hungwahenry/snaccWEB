import { describe, expect, it } from "vitest"
import type { AdminUserRow } from "../types"
import {
  accountStatus,
  earningSummary,
  payoutSummary,
  suspensionSummary,
  userBadges,
  userSubtitle,
} from "./users"

const user = (patch: Partial<AdminUserRow> = {}): AdminUserRow => ({
  id: "u1",
  username: "bola",
  display_name: "Bola",
  avatar_url: "",
  university: null,
  email: "bola@x.ng",
  role: "user",
  email_verified_at: null,
  suspended_at: null,
  suspended_until: null,
  suspended_note: null,
  suspended_reason: null,
  posts_globally: false,
  earnings_paused_at: null,
  earnings_paused_reason: null,
  payouts_blocked_at: null,
  payouts_blocked_reason: null,
  created_at: "2026-01-01T00:00:00Z",
  balance: 0,
  snaccs_count: 0,
  followers_count: 0,
  following_count: 0,
  total_views_received: 0,
  completed_at: null,
  ...patch,
})

describe("userSubtitle", () => {
  it("shows the handle and email, or just the email", () => {
    expect(userSubtitle(user())).toBe("@bola · bola@x.ng")
    expect(userSubtitle(user({ username: null }))).toBe("bola@x.ng")
  })
})

describe("accountStatus", () => {
  it("says whether the account is suspended", () => {
    expect(accountStatus(user()).label).toBe("Active")
    expect(
      accountStatus(user({ suspended_at: "2026-01-02T00:00:00Z" }))
    ).toEqual({ label: "Suspended", variant: "destructive" })
  })
})

describe("userBadges", () => {
  it("lists only what is unusual about the account", () => {
    expect(userBadges(user())).toEqual([])
    expect(
      userBadges(
        user({
          role: "admin",
          posts_globally: true,
          payouts_blocked_at: "2026-01-02T00:00:00Z",
        })
      ).map((badge) => badge.label)
    ).toEqual(["Owner", "Posts everywhere", "Withdrawals blocked"])
  })
})

describe("summaries", () => {
  it("describes an account in good standing", () => {
    expect(suspensionSummary(user())).toMatch(/as normal/)
    expect(earningSummary(user())).toMatch(/keeps paying/)
    expect(payoutSummary(user())).toMatch(/cash out/)
  })

  it("says when a suspension lifts and why it happened", () => {
    const text = suspensionSummary(
      user({
        suspended_at: "2026-09-01T10:00:00Z",
        suspended_until: null,
        suspended_reason: { id: "r", slug: "spam", label: "Spam" },
      })
    )
    expect(text).toMatch(/^Since /)
    expect(text).toMatch(/until someone lifts it\. Spam$/)
  })

  it("carries the reason for a pause or a block", () => {
    expect(
      earningSummary(
        user({
          earnings_paused_at: "2026-09-01T10:00:00Z",
          earnings_paused_reason: "Farming",
        })
      )
    ).toMatch(/^Paused .*\. Farming$/)
    expect(
      payoutSummary(user({ payouts_blocked_at: "2026-09-01T10:00:00Z" }))
    ).toMatch(/^Blocked /)
  })
})
