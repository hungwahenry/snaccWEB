import { BanknoteIcon, CircleDashedIcon } from "lucide-react"
import { describe, expect, it } from "vitest"
import type { EarningsMilestone } from "../types"
import {
  clearedCount,
  clearedLabel,
  earningsLine,
  milestoneLook,
  progressPercent,
} from "./milestones"

const milestones: EarningsMilestone[] = [
  { key: "balance", current: 250_000, target: 500_000, met: false },
  { key: "views", current: 12_400, target: 10_000, met: true },
  { key: "followers", current: 40, target: 100, met: false },
]

describe("progressPercent", () => {
  it("rounds, caps at full, and is empty with nothing to reach", () => {
    expect(progressPercent(1, 3)).toBe(33)
    expect(progressPercent(15, 10)).toBe(100)
    expect(progressPercent(5, 0)).toBe(0)
  })
})

describe("milestoneLook", () => {
  it("shows money milestones in naira", () => {
    expect(milestoneLook(milestones[0])).toEqual({
      label: "Minimum earnings",
      icon: BanknoteIcon,
      progress: "₦2,500 / ₦5,000",
      percent: 50,
    })
  })

  it("shows counts compactly and caps the bar at full", () => {
    expect(milestoneLook(milestones[1])).toMatchObject({
      label: "Total views",
      progress: "12.4k / 10k",
      percent: 100,
    })
  })

  it("copes with a milestone it does not know yet", () => {
    expect(
      milestoneLook({ key: "streak", current: 1, target: 4, met: false })
    ).toMatchObject({ label: "streak", icon: CircleDashedIcon, percent: 25 })
  })
})

describe("cleared milestones", () => {
  it("counts the ones met", () => {
    expect(clearedCount(milestones)).toBe(1)
    expect(clearedLabel(milestones)).toBe("1 of 3 cleared")
  })
})

describe("earningsLine", () => {
  it("invites a claim once earnings can move", () => {
    expect(
      earningsLine({ balance: 150_000, claimable: true, milestones })
    ).toBe("₦1,500 ready to claim")
  })

  it("shows progress until then", () => {
    expect(
      earningsLine({ balance: 150_000, claimable: false, milestones })
    ).toBe("₦1,500 earned — 1 of 3 milestones")
  })
})
