import { describe, expect, it } from "vitest"
import type { OpsDrift, OpsHealth } from "../types"
import {
  driftRows,
  healthFacts,
  missingCountsNote,
  reconcileMessage,
  repairMessage,
  retryMessage,
} from "./ops"

const clean: OpsDrift = {
  profiles: {
    snaccs_count: 0,
    followers_count: 0,
    following_count: 0,
    total_views_received: 0,
    unread_notifications_count: 0,
  },
  snaccs: {
    reactions_count: 0,
    resnaccs_count: 0,
    views_count: 0,
    comments_count: 0,
    quotes_count: 0,
    bookmarks_count: 0,
    shares_count: 0,
    author_taps_count: 0,
    hides_count: 0,
    reports_count: 0,
    opens_count: 0,
    dwell_ms_total: 0,
  },
  scores: { score: 0, tier: 0 },
  wallets: { accounts: 0 },
  earnings: { profiles: 0 },
  premium: { profiles: 0 },
}

describe("driftRows", () => {
  it("is empty when everything matches", () => {
    expect(driftRows(clean)).toEqual([])
  })

  it("lists each number that is off, and whether Repair fixes it", () => {
    const rows = driftRows({
      ...clean,
      profiles: { ...clean.profiles, followers_count: 3 },
      premium: { profiles: 2 },
    })
    expect(rows).toEqual([
      {
        key: "profiles.followers_count",
        label: "Followers",
        off: 3,
        repairable: true,
      },
      {
        key: "premium.profiles",
        label: "Premium status vs subscription",
        off: 2,
        repairable: false,
      },
    ])
  })
})

describe("healthFacts", () => {
  const health: OpsHealth = {
    status: "ok",
    database: { ok: true, latency_ms: 4 },
    queue_driver: "inline",
    memory: { rss_mb: 1200, heap_used_mb: 300 },
    uptime_seconds: 3_660,
    node_version: "v22.1.0",
    started_at: "2026-09-01T00:00:00Z",
  }

  it("describes the services and the process in words", () => {
    const facts = healthFacts(health)
    expect(facts.services.map((fact) => fact.value)).toEqual([
      "Reachable · 4 ms",
      "Inline, no Redis",
      "1h 1m",
    ])
    expect(facts.process[0].value).toBe("1,200 MB")
  })

  it("says when the database cannot be reached", () => {
    expect(
      healthFacts({ ...health, database: { ok: false, latency_ms: 0 } })
        .services[0].value
    ).toBe("Unreachable")
  })
})

describe("messages", () => {
  it("explains a queue with no counts", () => {
    expect(missingCountsNote("inline")).toMatch(/inline/)
    expect(missingCountsNote("redis")).toMatch(/Couldn't read/)
  })

  it("counts retried jobs in words", () => {
    expect(retryMessage(0)).toBe("No failed jobs were left to retry.")
    expect(retryMessage(1)).toBe("Retried 1 failed job.")
  })

  it("adds up every repair", () => {
    expect(repairMessage([{ a: 0 }, {}])).toBe("Nothing needed repairing.")
    expect(repairMessage([{ a: 2 }, { b: 1 }])).toMatch(/^Rewrote 3 rows\./)
  })

  it("says what a reconcile moved", () => {
    const none = {
      withdrawals: { checked: 0, settled: 0, failed: 0, waiting: 0 },
      deposits: { checked: 0, credited: 0 },
    }
    expect(reconcileMessage(none)).toBe(
      "Nothing to settle. Paystack agrees with us."
    )
    expect(
      reconcileMessage({
        withdrawals: { checked: 4, settled: 2, failed: 1, waiting: 1 },
        deposits: { checked: 1, credited: 1 },
      })
    ).toBe(
      "Paid out 2 withdrawals, refunded 1 failed withdrawal and credited 1 top-up. 1 withdrawal still waiting on Paystack."
    )
    expect(
      reconcileMessage({
        ...none,
        withdrawals: { ...none.withdrawals, waiting: 2 },
      })
    ).toBe("Nothing settled yet. 2 withdrawals still waiting on Paystack.")
  })
})
