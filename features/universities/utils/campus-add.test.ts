import { describe, expect, it } from "vitest"
import { campusDetail, campusNameReady } from "./campus-add"

describe("campusNameReady", () => {
  it("wants a real name, not a stray letter or two", () => {
    expect(campusNameReady(" UG ")).toBe(false)
    expect(campusNameReady("UCC")).toBe(true)
  })
})

describe("campusDetail", () => {
  it("reads short name and country, and says when a campus is still being added", () => {
    expect(campusDetail({ acronym: "UG", status: "verified" }, "Ghana")).toBe(
      "UG · Ghana"
    )
    expect(campusDetail({ acronym: "UCC", status: "pending" }, null)).toBe(
      "UCC · Being added"
    )
  })
})
