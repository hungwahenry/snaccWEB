import { describe, expect, it } from "vitest"
import { NIGERIAN_STATES, STATE_OPTIONS, stateName } from "./states"

describe("stateName", () => {
  it("writes a state the way people read it", () => {
    expect(stateName("lagos")).toBe("Lagos")
    expect(stateName("akwa_ibom")).toBe("Akwa Ibom")
    expect(stateName("cross_river")).toBe("Cross River")
  })

  it("names the capital territory in full", () => {
    expect(stateName("fct")).toBe("FCT (Abuja)")
  })
})

describe("STATE_OPTIONS", () => {
  it("offers all 36 states and the FCT", () => {
    expect(NIGERIAN_STATES).toHaveLength(37)
    expect(STATE_OPTIONS[0]).toEqual({ value: "abia", label: "Abia" })
    expect(STATE_OPTIONS.at(-1)).toEqual({ value: "fct", label: "FCT (Abuja)" })
  })
})
