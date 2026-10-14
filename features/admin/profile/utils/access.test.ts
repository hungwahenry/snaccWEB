import { describe, expect, it } from "vitest"
import type { AdminGrant } from "@/features/admin/roles/types"
import type { OwnAccess } from "../types"
import { campusNote, permissionsSummary } from "./access"

const grant = (acronym: string | null): AdminGrant => ({
  id: `g-${acronym}`,
  role: {
    id: "r1",
    slug: "moderator",
    name: "Moderator",
    allow_all: false,
    is_system: false,
  },
  campus: acronym ? { id: acronym, name: acronym, acronym } : null,
  created_at: "2026-01-01T00:00:00.000Z",
})

const access = (overrides: Partial<OwnAccess> = {}): OwnAccess => ({
  all: false,
  grants: [],
  permissions: [],
  ...overrides,
})

describe("permissionsSummary", () => {
  it("says full access, or how many permissions", () => {
    expect(permissionsSummary(access({ all: true }))).toBe(
      "Full access. Every permission below, including any added later."
    )
    expect(
      permissionsSummary(
        access({
          permissions: [
            {
              key: "users.read",
              resource: "users",
              action: "read",
              description: "Read · Users",
              per_campus: true,
            },
          ],
        })
      )
    ).toBe("1 permission, and only these.")
  })
})

describe("campusNote", () => {
  it("names the campuses when every role is limited to one", () => {
    expect(campusNote([grant("HOME"), grant("AWAY"), grant("HOME")])).toBe(
      "Your roles cover HOME, AWAY only, so you see and act on their people and posts."
    )
  })

  it("says nothing when any role reaches every campus", () => {
    expect(campusNote([grant("HOME"), grant(null)])).toBeNull()
    expect(campusNote([])).toBeNull()
  })
})
