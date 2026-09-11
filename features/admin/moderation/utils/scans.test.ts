import { describe, expect, it } from "vitest"
import type { ModerationScan } from "../types"
import { isEnforced, latencyLabel, scanScore, scanTarget } from "./scans"

const scan = (overrides: Partial<ModerationScan> = {}): ModerationScan => ({
  id: "s1",
  surface: "snacc",
  target: {
    snacc_id: null,
    moment_id: null,
    message_id: null,
    user_id: null,
  },
  model: "omni-moderation",
  flagged: true,
  scores: {},
  verdict: "hold",
  applied: "hold",
  category: "harassment",
  score: 0.91234,
  rule: null,
  report_id: null,
  error: null,
  latency_ms: 120,
  created_at: "2026-09-01T00:00:00Z",
  ...overrides,
})

describe("scanTarget", () => {
  it("links the snacc first, then the person, else nothing", () => {
    const target = scan().target
    expect(
      scanTarget(scan({ target: { ...target, snacc_id: "p1", user_id: "u1" } }))
    ).toBe("/admin/snaccs/p1")
    expect(scanTarget(scan({ target: { ...target, user_id: "u1" } }))).toBe(
      "/admin/users/u1"
    )
    expect(scanTarget(scan())).toBeNull()
  })
})

describe("isEnforced", () => {
  it("tells a decision that was carried out from one that was not", () => {
    expect(isEnforced(scan())).toBe(true)
    expect(isEnforced(scan({ applied: "allow" }))).toBe(false)
  })
})

describe("scanScore", () => {
  it("gives the deciding category with its score", () => {
    expect(scanScore(scan())).toBe("harassment 0.912")
    expect(scanScore(scan({ score: null }))).toBe("harassment")
    expect(scanScore(scan({ category: null }))).toBeNull()
  })
})

describe("latencyLabel", () => {
  it("shows milliseconds, or a dash when there are none", () => {
    expect(latencyLabel(120)).toBe("120 ms")
    expect(latencyLabel(null)).toBe("—")
    expect(latencyLabel(0)).toBe("—")
  })
})
