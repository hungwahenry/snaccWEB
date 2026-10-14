import { describe, expect, it } from "vitest"
import type { AdminGrant, AdminPermission, AdminRole } from "../types"
import {
  accessSummary,
  draftFrom,
  grantableRoles,
  grantLabel,
  groupKeys,
  groupPermissions,
  isDraftReady,
  isSlugValid,
  lacksRead,
  toCreateInput,
  toggleKey,
  toUpdateInput,
} from "./roles"

const role = (patch: Partial<AdminRole> = {}): AdminRole => ({
  id: "r1",
  slug: "finance",
  name: "Finance",
  description: null,
  allow_all: false,
  is_system: false,
  permission_keys: [],
  created_at: "2026-01-01T00:00:00Z",
  ...patch,
})

const grant = (roleId: string, acronym: string | null = null): AdminGrant => ({
  id: `g-${roleId}`,
  role: {
    id: roleId,
    slug: roleId,
    name: roleId.toUpperCase(),
    allow_all: false,
    is_system: false,
  },
  campus: acronym ? { id: "s1", name: acronym, acronym } : null,
  created_at: "2026-01-01T00:00:00Z",
})

const permission = (key: string): AdminPermission => {
  const [resource, action] = key.split(".")
  return { key, resource, action, description: "", per_campus: false }
}

describe("role drafts", () => {
  it("wants a name, and a proper slug only when creating", () => {
    expect(isDraftReady({ ...draftFrom(), name: "Ops" }, false)).toBe(false)
    expect(isDraftReady({ ...draftFrom(), name: "Ops" }, true)).toBe(true)
    expect(
      isDraftReady({ slug: "ops_team", name: "Ops", description: "" }, false)
    ).toBe(true)
  })

  it("checks the slug the way the API does", () => {
    expect(isSlugValid("finance-2")).toBe(true)
    expect(isSlugValid("Finance")).toBe(true)
    expect(isSlugValid("2finance")).toBe(false)
    expect(isSlugValid("fin ance")).toBe(false)
  })

  it("trims, lowercases the slug and lets a description be cleared", () => {
    const draft = { slug: " Ops ", name: " Ops ", description: " " }
    expect(toCreateInput(draft)).toEqual({
      slug: "ops",
      name: "Ops",
      description: undefined,
    })
    expect(toUpdateInput(draft)).toEqual({ name: "Ops", description: "" })
  })

  it("starts from the role being edited", () => {
    expect(draftFrom(role({ description: "Pays people" }))).toEqual({
      slug: "finance",
      name: "Finance",
      description: "Pays people",
    })
  })
})

describe("accessSummary", () => {
  it("says full access or counts permissions", () => {
    expect(accessSummary(role({ allow_all: true }))).toBe("Full access")
    expect(accessSummary(role({ permission_keys: ["a.b"] }))).toBe(
      "1 permission"
    )
    expect(accessSummary(role({ permission_keys: ["a.b", "a.c"] }))).toBe(
      "2 permissions"
    )
  })
})

describe("groupPermissions", () => {
  it("groups by resource in catalog order", () => {
    const groups = groupPermissions([
      permission("users.read"),
      permission("roles.read"),
      permission("users.delete"),
    ])
    expect(groups.map((group) => group.resource)).toEqual(["users", "roles"])
    expect(groups[0].permissions.map((each) => each.action)).toEqual([
      "read",
      "delete",
    ])
  })
})

describe("groupKeys", () => {
  it("sorts keys and groups their actions", () => {
    expect(groupKeys(["users.read", "audit.read", "users.delete"])).toEqual([
      ["audit", ["read"]],
      ["users", ["delete", "read"]],
    ])
  })
})

describe("lacksRead", () => {
  const [users] = groupPermissions([
    permission("users.read"),
    permission("users.suspend"),
  ])
  const [ops] = groupPermissions([permission("ops.run")])

  it("flags an action ticked without its read", () => {
    expect(lacksRead(users, new Set(["users.suspend"]))).toBe(true)
  })

  it("is quiet once read is ticked, when nothing is, or when there is no read", () => {
    expect(lacksRead(users, new Set(["users.read", "users.suspend"]))).toBe(
      false
    )
    expect(lacksRead(users, new Set())).toBe(false)
    expect(lacksRead(ops, new Set(["ops.run"]))).toBe(false)
  })
})

describe("toggleKey", () => {
  it("adds a missing key and removes a present one without mutating", () => {
    const start = new Set(["a"])
    expect([...toggleKey(start, "b")]).toEqual(["a", "b"])
    expect([...toggleKey(start, "a")]).toEqual([])
    expect([...start]).toEqual(["a"])
  })
})

describe("grants", () => {
  it("labels a campus grant with the campus it covers", () => {
    expect(grantLabel(grant("ops"))).toBe("OPS")
    expect(grantLabel(grant("mod", "UNILAG"))).toBe("MOD · UNILAG")
  })

  it("offers roles not already held everywhere, so a campus grant can be widened", () => {
    expect(
      grantableRoles(
        [role({ id: "ops", name: "Ops" }), role({ id: "mod", name: "Mod" })],
        [grant("ops"), grant("mod", "UNILAG")]
      )
    ).toEqual([{ value: "mod", label: "Mod" }])
  })
})
