import { describe, expect, it } from "vitest"
import type { Availability } from "../types"
import { mustPickAgain, waitingLine, waitingTitle } from "./notice"

const waiting: Availability = {
  open: false,
  campus: {
    id: "c1",
    name: "University of Ghana",
    acronym: "UG",
    status: "verified",
  },
  country: { code: "GH", name: "Ghana" },
  email: "ama@example.com",
}

const withStatus = (status: "pending" | "rejected"): Availability => ({
  ...waiting,
  campus: { ...waiting.campus!, status },
})

describe("the waiting notice", () => {
  it("names the campus and the address the email goes to", () => {
    expect(waitingTitle(waiting)).toBe("You're on the list")
    expect(waitingLine(waiting)).toBe(
      "Snacc isn't open at University of Ghana yet. We'll email ama@example.com the moment it is."
    )
  })

  it("still reads well without a campus", () => {
    expect(waitingLine({ ...waiting, campus: null })).toBe(
      "Snacc isn't open at your campus yet. We'll email ama@example.com the moment it is."
    )
  })

  it("says a campus someone added is being checked", () => {
    expect(waitingTitle(withStatus("pending"))).toBe("We're adding your campus")
    expect(waitingLine(withStatus("pending"))).toBe(
      "We're checking University of Ghana now. We'll email ama@example.com the moment you're in."
    )
    expect(mustPickAgain(withStatus("pending"))).toBe(false)
  })

  it("asks them to pick again when it was turned down", () => {
    expect(waitingTitle(withStatus("rejected"))).toBe(
      "We couldn't add your campus"
    )
    expect(mustPickAgain(withStatus("rejected"))).toBe(true)
  })
})
