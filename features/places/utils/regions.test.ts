import { describe, expect, it } from "vitest"
import type { PlaceRegion } from "../types"
import {
  groupCoverage,
  groupSummary,
  namedRegions,
  regionGroups,
  regionPath,
  toggleGroup,
  toggleMember,
} from "./regions"

const region = (id: string, parent: string | null = null): PlaceRegion => ({
  id,
  parent_id: parent,
  slug: id,
  name: id.charAt(0).toUpperCase() + id.slice(1),
})

const REGIONS = [
  region("west"),
  region("lagos", "west"),
  region("oyo", "west"),
  region("north"),
  region("kano", "north"),
  region("island"),
]

const [west, north, loose] = regionGroups(REGIONS)

describe("regionGroups", () => {
  it("groups regions under their parent and keeps lone regions together", () => {
    expect(west.region?.id).toBe("west")
    expect(west.members.map((member) => member.id)).toEqual(["lagos", "oyo"])
    expect(north.members.map((member) => member.id)).toEqual(["kano"])
    expect(loose).toEqual({ region: null, members: [region("island")] })
  })

  it("leaves out the loose group when every region has a parent or children", () => {
    expect(regionGroups(REGIONS.slice(0, 5))).toHaveLength(2)
  })
})

describe("picking regions", () => {
  it("picks a whole group as the group itself", () => {
    expect(toggleGroup([], west)).toEqual(["west"])
    expect(groupCoverage(west, ["west"])).toBe("all")
    expect(toggleGroup(["west"], west)).toEqual([])
  })

  it("splits a picked group when one of its members is taken out", () => {
    expect(toggleMember(["west"], west, "lagos")).toEqual(["oyo"])
    expect(groupCoverage(west, ["oyo"])).toBe("some")
    expect(groupSummary(west, ["oyo"])).toBe("1 of 2")
  })

  it("folds every member back into the group", () => {
    expect(toggleMember(["oyo"], west, "lagos")).toEqual(["west"])
  })

  it("keeps lone regions as themselves", () => {
    expect(toggleMember([], loose, "island")).toEqual(["island"])
    expect(groupSummary(loose, [])).toBe("")
  })
})

describe("naming regions", () => {
  it("reads a region with the regions above it", () => {
    expect(regionPath(REGIONS, "lagos")).toBe("West › Lagos")
    expect(regionPath(REGIONS, "island")).toBe("Island")
  })

  it("names picked regions in their own order", () => {
    expect(namedRegions(REGIONS, ["kano", "west"])).toEqual([
      { id: "west", name: "West" },
      { id: "kano", name: "Kano" },
    ])
  })
})
