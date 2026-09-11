import { describe, expect, it } from "vitest"
import type { AdminGrant } from "@/features/admin/roles/types"
import type { AdminAccount } from "../types"
import { grantLabel, grantVariant } from "@/features/admin/roles/utils/roles"
import { adminRef, adminSince } from "./admins"

const grant = (overrides: Partial<AdminGrant> = {}): AdminGrant => ({
  id: "g1",
  role: {
    id: "r1",
    slug: "moderator",
    name: "Moderator",
    allow_all: false,
    is_system: false,
  },
  scope_type: null,
  scope_id: null,
  created_at: "2026-05-01T10:00:00.000Z",
  ...overrides,
})

const admin = (grants: AdminGrant[]): AdminAccount => ({
  id: "u1",
  email: "ada@snacc.ng",
  username: "ada",
  display_name: "Ada",
  avatar_url: "https://cdn/a.png",
  is_owner_account: false,
  grants,
  created_at: "2025-01-01T00:00:00.000Z",
})

describe("adminRef", () => {
  it("keeps only what a person cell needs", () => {
    expect(adminRef(admin([]))).toEqual({
      id: "u1",
      username: "ada",
      display_name: "Ada",
      avatar_url: "https://cdn/a.png",
    })
  })
})

describe("grantVariant", () => {
  it("fills the badge for a role that can do everything", () => {
    expect(grantVariant(grant())).toBe("outline")
    expect(
      grantVariant(grant({ role: { ...grant().role, allow_all: true } }))
    ).toBe("default")
  })
})

describe("grantLabel", () => {
  const acronyms = new Map([["c1", "UNILAG"]])

  it("names a global role plainly", () => {
    expect(grantLabel(grant(), acronyms)).toBe("Moderator")
  })

  it("adds the campus a role is limited to", () => {
    expect(
      grantLabel(grant({ scope_type: "university", scope_id: "c1" }), acronyms)
    ).toBe("Moderator · UNILAG")
    expect(
      grantLabel(grant({ scope_type: "university", scope_id: "c9" }), acronyms)
    ).toBe("Moderator · one campus")
  })

  it("still says a role is limited when the scope is unfamiliar", () => {
    expect(
      grantLabel(grant({ scope_type: "region", scope_id: "x" }), acronyms)
    ).toBe("Moderator · limited")
  })
})

describe("adminSince", () => {
  it("is the earliest grant, not when the account was made", () => {
    expect(
      adminSince(
        admin([
          grant({ created_at: "2026-06-01T00:00:00.000Z" }),
          grant({ id: "g2", created_at: "2026-03-01T00:00:00.000Z" }),
        ])
      )
    ).toBe("2026-03-01T00:00:00.000Z")
  })

  it("falls back to the account date with no grants", () => {
    expect(adminSince(admin([]))).toBe("2025-01-01T00:00:00.000Z")
  })
})
