import { describe, expect, it } from "vitest"
import type { AdminPermissions } from "@/lib/permissions"
import {
  dashboardTabs,
  funnelSteps,
  hoursLabel,
  mostActiveCampuses,
  PERIOD_OPTIONS,
  platformRows,
  reachableCampuses,
  retentionRows,
  scopeNote,
  seesMoney,
  share,
  shownTab,
  withBarFractions,
} from "./dashboard"

describe("PERIOD_OPTIONS", () => {
  it("offers the three periods the backend accepts", () => {
    expect(PERIOD_OPTIONS).toEqual([
      { value: "7", label: "Last 7 days" },
      { value: "30", label: "Last 30 days" },
      { value: "90", label: "Last 90 days" },
    ])
  })
})

describe("share", () => {
  it("is the part over the whole, and zero when there is no whole", () => {
    expect(share(1, 4)).toBe(0.25)
    expect(share(3, 0)).toBe(0)
  })
})

describe("platformRows", () => {
  it("names each platform, gives its share of everyone, and each version's share of the platform", () => {
    const [android, web] = platformRows([
      {
        platform: "android",
        users: 3,
        versions: [
          { version: "1.4.0", users: 2 },
          { version: "unknown", users: 1 },
        ],
      },
      {
        platform: "web",
        users: 1,
        versions: [{ version: "unknown", users: 1 }],
      },
    ])

    expect(android).toMatchObject({
      label: "Android",
      users: 3,
      fraction: 0.75,
    })
    expect(android.versions).toEqual([
      { version: "1.4.0", label: "v1.4.0", users: 2, fraction: 2 / 3 },
      { version: "unknown", label: "Unknown", users: 1, fraction: 1 / 3 },
    ])
    expect(web.label).toBe("Web")
    expect(web.versions).toEqual([])
  })
})

describe("withBarFractions", () => {
  it("measures every row against the biggest one", () => {
    expect(
      withBarFractions(
        [
          { tag: "a", uses: 4 },
          { tag: "b", uses: 1 },
        ],
        (row) => row.uses
      )
    ).toEqual([
      { tag: "a", uses: 4, fraction: 1 },
      { tag: "b", uses: 1, fraction: 0.25 },
    ])
  })

  it("is empty for no rows", () => {
    expect(withBarFractions([], () => 0)).toEqual([])
  })
})

describe("funnelSteps", () => {
  it("measures every step against the people who signed up", () => {
    const steps = funnelSteps({
      signed_up: 200,
      onboarded: 150,
      posted: 50,
      reacted: 100,
      followed: 80,
      returned: 120,
    })

    expect(steps.map((step) => [step.key, step.count, step.fraction])).toEqual([
      ["signed_up", 200, 1],
      ["onboarded", 150, 0.75],
      ["posted", 50, 0.25],
      ["reacted", 100, 0.5],
      ["followed", 80, 0.4],
      ["returned", 120, 0.6],
    ])
  })

  it("is all zeros when nobody signed up", () => {
    const steps = funnelSteps({
      signed_up: 0,
      onboarded: 0,
      posted: 0,
      reacted: 0,
      followed: 0,
      returned: 0,
    })

    expect(steps.every((step) => step.fraction === 0)).toBe(true)
  })
})

describe("reachableCampuses", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ]
  const permissions = (campuses: string[]): AdminPermissions => ({
    all: false,
    keys: ["dashboard.read"],
    campuses,
  })

  it("offers every campus to a platform-wide admin", () => {
    expect(reachableCampuses(options, permissions([]))).toEqual(options)
  })

  it("offers a confined admin only their own campuses", () => {
    expect(reachableCampuses(options, permissions(["b"]))).toEqual([
      { value: "b", label: "Beta" },
    ])
  })

  it("offers nothing until permissions load", () => {
    expect(reachableCampuses(options, undefined)).toEqual([])
  })
})

describe("scopeNote", () => {
  it("names the chosen campus", () => {
    expect(scopeNote(false, "UNILAG")).toBe("These numbers cover UNILAG only.")
  })

  it("explains a confined view", () => {
    expect(scopeNote(false, undefined)).toBe(
      "These numbers cover your campuses only."
    )
  })

  it("says nothing for the whole platform", () => {
    expect(scopeNote(true, undefined)).toBeNull()
  })
})

describe("money tab", () => {
  const permissions = (campuses: string[]): AdminPermissions => ({
    all: false,
    keys: ["dashboard.read"],
    campuses,
  })

  it("is only for admins who see the whole platform", () => {
    expect(seesMoney(permissions([]))).toBe(true)
    expect(seesMoney(permissions(["a"]))).toBe(false)
    expect(seesMoney(undefined)).toBe(false)
  })

  it("drops out of the tab list, and a link to it lands on the overview", () => {
    expect(dashboardTabs(false).map((tab) => tab.value)).not.toContain("money")
    expect(dashboardTabs(true).map((tab) => tab.value)).toContain("money")
    expect(shownTab("money", false)).toBe("overview")
    expect(shownTab("money", true)).toBe("money")
  })
})

describe("retentionRows", () => {
  it("shows each week's share of the cohort, and leaves weeks still to come empty", () => {
    const [row] = retentionRows([
      { week: "2026-09-21", size: 10, active: [10, 4] },
    ])

    expect(row.cells.slice(0, 3)).toEqual([
      { users: 10, fraction: 1 },
      { users: 4, fraction: 0.4 },
      null,
    ])
    expect(row.cells).toHaveLength(9)
  })
})

describe("hoursLabel", () => {
  it("reads minutes, hours or days, whichever is natural", () => {
    expect(hoursLabel(null)).toBe("—")
    expect(hoursLabel(0.25)).toBe("15m")
    expect(hoursLabel(5.4)).toBe("5h")
    expect(hoursLabel(72)).toBe("3d")
  })
})

describe("mostActiveCampuses", () => {
  const campus = (id: string, weekly_active: number) => ({
    id,
    name: id,
    acronym: id,
    members: 10,
    joined: 0,
    weekly_active,
    posts: 0,
    funded: false,
  })

  it("ranks campuses by this week's actives and leaves out quiet ones", () => {
    const ranked = mostActiveCampuses([
      campus("a", 3),
      campus("b", 0),
      campus("c", 9),
    ])

    expect(ranked.map((row) => [row.id, row.fraction])).toEqual([
      ["c", 1],
      ["a", 3 / 9],
    ])
  })
})
