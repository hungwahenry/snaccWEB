import { describe, expect, it } from "vitest"
import type { AuditLog } from "../types"
import {
  actionLabel,
  actionOptions,
  adminLabel,
  auditQuery,
  hasSnapshot,
  SEARCH_MAX,
  targetHref,
} from "./audit"

const log = (overrides: Partial<AuditLog> = {}): AuditLog => ({
  id: "l1",
  admin_id: "a1",
  admin_email: "ada@snacc.ng",
  admin_username: "ada",
  action: "user.suspend",
  target_type: "user",
  target_id: "u1",
  before: null,
  after: null,
  created_at: "2026-09-01T10:00:00.000Z",
  ...overrides,
})

describe("auditQuery", () => {
  it("drops empty filters", () => {
    expect(auditQuery({ page: 1, perPage: 20, q: "  ", action: null })).toEqual(
      { page: 1, perPage: 20, q: undefined, action: undefined }
    )
  })

  it("trims the search and keeps the action", () => {
    expect(
      auditQuery({ page: 2, perPage: 20, q: " ada ", action: "page.publish" })
    ).toEqual({ page: 2, perPage: 20, q: "ada", action: "page.publish" })
  })

  it("caps the search at what the API accepts", () => {
    const q = auditQuery({
      page: 1,
      perPage: 20,
      q: "x".repeat(SEARCH_MAX + 20),
      action: null,
    }).q
    expect(q).toHaveLength(SEARCH_MAX)
  })
})

describe("actionLabel", () => {
  it("reads the area, then what happened", () => {
    expect(actionLabel("user.suspend")).toBe("User: suspend")
    expect(actionLabel("ops.run.repair-counters")).toBe(
      "Ops: run repair counters"
    )
    expect(actionLabel("wallet_account.adjust")).toBe("Wallet account: adjust")
  })

  it("handles an action with no area", () => {
    expect(actionLabel("reconcile")).toBe("Reconcile")
  })
})

describe("actionOptions", () => {
  it("keeps the raw action as the value", () => {
    expect(actionOptions(["page.publish"])).toEqual([
      { value: "page.publish", label: "Page: publish" },
    ])
  })
})

describe("adminLabel", () => {
  it("uses the handle, then the email", () => {
    expect(adminLabel(log())).toBe("@ada")
    expect(adminLabel(log({ admin_username: null }))).toBe("ada@snacc.ng")
  })
})

describe("targetHref", () => {
  it("links things that have a page in the panel", () => {
    expect(targetHref(log())).toBe("/admin/users/u1")
    expect(targetHref(log({ target_type: "wallet_account" }))).toBe(
      "/admin/wallet/u1"
    )
    expect(targetHref(log({ target_type: "page", target_id: "p1" }))).toBe(
      "/admin/pages/p1"
    )
  })

  it("leaves the rest unlinked", () => {
    expect(targetHref(log({ target_type: "config" }))).toBeNull()
    expect(targetHref(log({ target_id: null }))).toBeNull()
  })
})

describe("hasSnapshot", () => {
  it("is true when either side was recorded", () => {
    expect(hasSnapshot(log())).toBe(false)
    expect(hasSnapshot(log({ after: { status: "published" } }))).toBe(true)
    expect(hasSnapshot(log({ before: { title: "x" } }))).toBe(true)
  })
})
