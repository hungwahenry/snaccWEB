import { describe, expect, it } from "vitest"
import type { AdminGrant, AdminPermission } from "@/features/admin/roles/types"
import type { AdminPermissions } from "@/lib/permissions"
import { grantText, permissionsSummary, visibleKeys } from "./access"

const permissions = (
  overrides: Partial<AdminPermissions> = {}
): AdminPermissions => ({ all: false, keys: [], campuses: [], ...overrides })

const permission = (key: string): AdminPermission => {
  const [resource, action] = key.split(".")
  return { key, resource, action, description: "" }
}

const grant = (scope_type: string | null): AdminGrant => ({
  id: "g1",
  role: {
    id: "r1",
    slug: "moderator",
    name: "Moderator",
    allow_all: false,
    is_system: false,
  },
  scope_type,
  scope_id: scope_type ? "u1" : null,
  created_at: "2026-01-01T00:00:00.000Z",
})

describe("visibleKeys", () => {
  const catalog = [permission("users.read"), permission("snaccs.delete")]

  it("shows the whole catalogue for full access", () => {
    expect(
      visibleKeys(permissions({ all: true, keys: ["users.read"] }), catalog)
    ).toEqual(["users.read", "snaccs.delete"])
  })

  it("shows only what was granted otherwise", () => {
    expect(visibleKeys(permissions({ keys: ["users.read"] }), catalog)).toEqual(
      ["users.read"]
    )
  })
})

describe("permissionsSummary", () => {
  it("says full access, or how many permissions", () => {
    expect(permissionsSummary(permissions({ all: true }))).toBe(
      "Full access. Every permission below, including any added later."
    )
    expect(permissionsSummary(permissions({ keys: ["users.read"] }))).toBe(
      "1 permission, and only these."
    )
    expect(permissionsSummary(permissions({ keys: ["a.b", "c.d"] }))).toBe(
      "2 permissions, and only these."
    )
  })
})

describe("grantText", () => {
  it("names the role, and its scope when it has one", () => {
    expect(grantText(grant(null))).toBe("Moderator")
    expect(grantText(grant("university"))).toBe("Moderator · university")
  })
})
