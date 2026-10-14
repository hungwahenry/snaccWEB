import { describe, expect, it } from "vitest"
import type { AdminRegion } from "../types"
import {
  parentOptions,
  regionRows,
  toCampusTypeInput,
  toRegionInput,
  TOP_LEVEL,
  usageNote,
} from "./places"

const region = (
  id: string,
  name: string,
  parent_id: string | null = null
): AdminRegion => ({
  id,
  name,
  slug: id,
  parent_id,
  campuses: 0,
  promotions: 0,
  regions: 0,
})

const regions = [
  region("sw", "South West"),
  region("la", "Lagos", "sw"),
  region("ik", "Ikeja", "la"),
  region("nc", "North Central"),
  region("og", "Ogun", "sw"),
]

describe("regionRows", () => {
  it("lists each region under the one it sits in, by name", () => {
    expect(
      regionRows(regions).map(({ region, depth }) => [region.id, depth])
    ).toEqual([
      ["nc", 0],
      ["sw", 0],
      ["la", 1],
      ["ik", 2],
      ["og", 1],
    ])
  })
})

describe("parentOptions", () => {
  it("never offers a region itself or anything inside it", () => {
    const values = parentOptions(regions, regions[0]).map((o) => o.value)
    expect(values).toEqual([TOP_LEVEL, "nc"])
  })

  it("indents by depth", () => {
    expect(parentOptions(regions).map((o) => o.label)).toContain("· · Ikeja")
  })
})

describe("inputs", () => {
  it("needs a name and turns top level into no parent", () => {
    expect(toRegionInput("  Kano ", TOP_LEVEL)).toEqual({
      name: "Kano",
      parentId: null,
    })
    expect(toRegionInput(" ", "nc")).toBeNull()
  })

  it("leaves the position to the server unless one is typed", () => {
    expect(toCampusTypeInput({ name: "Private", position: "" })).toEqual({
      name: "Private",
    })
    expect(toCampusTypeInput({ name: "Private", position: "2" })).toEqual({
      name: "Private",
      position: 2,
    })
    expect(toCampusTypeInput({ name: "Private", position: "x" })).toBeNull()
  })
})

describe("usageNote", () => {
  it("says what still uses a place", () => {
    expect(usageNote({ campuses: 0, promotions: 0 })).toBe("Not used yet")
    expect(usageNote({ campuses: 3, promotions: 1 })).toBe(
      "3 campuses · 1 promotion"
    )
  })
})
