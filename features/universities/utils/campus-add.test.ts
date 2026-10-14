import { describe, expect, it } from "vitest"
import { campusDetail, campusNameReady } from "./campus-add"

describe("campusNameReady", () => {
  it("wants a real name, not a stray letter or two", () => {
    expect(campusNameReady(" UG ")).toBe(false)
    expect(campusNameReady("UCC")).toBe(true)
  })
})

describe("campusDetail", () => {
  it("reads short name and country, and says when a campus is not open", () => {
    expect(
      campusDetail({ acronym: "UG", status: "verified", open: true }, "Ghana")
    ).toBe("UG · Ghana")
    expect(
      campusDetail({ acronym: "UCC", status: "pending", open: false }, null)
    ).toBe("UCC · Being added")
    expect(
      campusDetail({ acronym: "UCL", status: "verified", open: false }, "UK")
    ).toBe("UCL · UK · Not open yet")
  })
})
