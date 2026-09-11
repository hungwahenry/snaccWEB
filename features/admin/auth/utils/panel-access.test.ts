import { describe, expect, it } from "vitest"
import type { AdminPermissions } from "@/lib/permissions"
import { panelAccess } from "./panel-access"

const holding = (...keys: string[]): AdminPermissions => ({
  all: false,
  keys,
  campuses: [],
})

describe("panelAccess", () => {
  it("waits for the account to load", () => {
    expect(
      panelAccess({ pathname: "/admin", permissions: undefined, failed: false })
    ).toEqual({ state: "loading" })
  })

  it("sends someone out of the panel when the account fails or has no role", () => {
    expect(
      panelAccess({ pathname: "/admin", permissions: undefined, failed: true })
    ).toEqual({ state: "redirect", to: "/home" })
    expect(
      panelAccess({
        pathname: "/admin/users",
        permissions: holding(),
        failed: false,
      })
    ).toEqual({ state: "redirect", to: "/home" })
  })

  it("moves someone who cannot read the dashboard to their first page", () => {
    expect(
      panelAccess({
        pathname: "/admin",
        permissions: holding("withdrawals.read"),
        failed: false,
      })
    ).toEqual({ state: "redirect", to: "/admin/withdrawals" })
  })

  it("names the permission a page needs", () => {
    expect(
      panelAccess({
        pathname: "/admin/users/abc",
        permissions: holding("reports.read"),
        failed: false,
      })
    ).toEqual({ state: "denied", permission: "users.read" })
  })

  it("lets through pages the admin may read and pages outside the nav", () => {
    expect(
      panelAccess({
        pathname: "/admin/reports/1",
        permissions: holding("reports.read"),
        failed: false,
      })
    ).toEqual({ state: "allowed" })
    expect(
      panelAccess({
        pathname: "/admin/profile",
        permissions: holding("reports.read"),
        failed: false,
      })
    ).toEqual({ state: "allowed" })
  })
})
