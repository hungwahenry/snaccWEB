import { describe, expect, it } from "vitest"
import {
  REGIONS,
  regionCoverage,
  regionSummary,
  stateName,
  toggleRegion,
} from "./regions"

const southWest = REGIONS.find((region) => region.key === "south_west")!

describe("regions", () => {
  it("covers all 37 states, each once", () => {
    const states = REGIONS.flatMap((region) => region.states)
    expect(states).toHaveLength(37)
    expect(new Set(states).size).toBe(37)
  })

  it("names states the way people write them", () => {
    expect(stateName("lagos")).toBe("Lagos")
    expect(stateName("akwa_ibom")).toBe("Akwa Ibom")
    expect(stateName("cross_river")).toBe("Cross River")
    expect(stateName("fct")).toBe("FCT (Abuja)")
  })

  it("says how much of a region is picked", () => {
    expect(regionCoverage(southWest, [])).toBe("none")
    expect(regionCoverage(southWest, ["lagos", "kano"])).toBe("some")
    expect(regionCoverage(southWest, [...southWest.states])).toBe("all")
    expect(regionSummary(southWest, [])).toBe("")
    expect(regionSummary(southWest, ["lagos", "oyo"])).toBe("2 of 6")
    expect(regionSummary(southWest, [...southWest.states])).toBe("All")
  })

  it("fills a region in, then clears it, leaving other states alone", () => {
    const filled = toggleRegion(["lagos", "kano"], southWest)
    expect(filled).toHaveLength(7)
    expect(filled).toContain("kano")
    expect(regionCoverage(southWest, filled)).toBe("all")

    expect(toggleRegion(filled, southWest)).toEqual(["kano"])
  })
})
