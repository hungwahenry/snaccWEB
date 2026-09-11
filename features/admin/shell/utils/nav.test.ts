import { describe, expect, it } from "vitest"
import type { AdminPermissions } from "@/lib/permissions"
import {
  firstAllowedHref,
  isNavActive,
  NAV,
  permissionForPath,
  visibleNav,
} from "./nav"

const holding = (...keys: string[]): AdminPermissions => ({
  all: false,
  keys,
  campuses: [],
})

describe("visibleNav", () => {
  it("shows everything to someone with full access", () => {
    const all = visibleNav({ all: true, keys: [], campuses: [] })
    expect(all).toHaveLength(NAV.length)
  })

  it("drops items and then empty groups the permissions do not reach", () => {
    const sections = visibleNav(holding("reports.read", "audit.read"))
    expect(sections.map((section) => section.group)).toEqual([
      "Moderation",
      "Ops",
    ])
    expect(sections[0].items.map((item) => item.label)).toEqual(["Reports"])
  })

  it("shows nothing before the permissions load", () => {
    expect(visibleNav(undefined)).toEqual([])
  })
})

describe("firstAllowedHref", () => {
  it("lands on the first page the admin may open", () => {
    expect(firstAllowedHref(holding("wallet.read"))).toBe("/admin/wallet")
    expect(firstAllowedHref(holding())).toBeNull()
  })
})

describe("isNavActive", () => {
  it("matches the dashboard only exactly", () => {
    expect(isNavActive("/admin", "/admin")).toBe(true)
    expect(isNavActive("/admin", "/admin/users")).toBe(false)
  })

  it("matches a section and its detail pages but not a lookalike path", () => {
    expect(isNavActive("/admin/users", "/admin/users")).toBe(true)
    expect(isNavActive("/admin/users", "/admin/users/abc")).toBe(true)
    expect(isNavActive("/admin/reports", "/admin/report-reasons")).toBe(false)
  })
})

describe("permissionForPath", () => {
  it("finds the permission for a list and for its detail pages", () => {
    expect(permissionForPath("/admin/users")).toBe("users.read")
    expect(permissionForPath("/admin/users/abc")).toBe("users.read")
    expect(permissionForPath("/admin/pages/new")).toBe("pages.read")
  })

  it("prefers the most specific section", () => {
    expect(permissionForPath("/admin/report-reasons")).toBe(
      "report_reasons.read"
    )
  })

  it("returns null for pages outside the nav", () => {
    expect(permissionForPath("/admin/profile")).toBeNull()
  })

  it("does not gate the dashboard path's children through the dashboard", () => {
    expect(permissionForPath("/admin/unknown")).toBeNull()
  })
})
