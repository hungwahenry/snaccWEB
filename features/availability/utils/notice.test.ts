import { describe, expect, it } from "vitest"
import type { Availability } from "../types"
import { waitingLine } from "./notice"

const waiting: Availability = {
  open: false,
  campus: { id: "c1", name: "University of Ghana", acronym: "UG" },
  country: { code: "GH", name: "Ghana" },
  email: "ama@example.com",
}

describe("waitingLine", () => {
  it("names the campus and the address the email goes to", () => {
    expect(waitingLine(waiting)).toBe(
      "Snacc isn't open at University of Ghana yet. We'll email ama@example.com the moment it is."
    )
  })

  it("still reads well without a campus", () => {
    expect(waitingLine({ ...waiting, campus: null })).toBe(
      "Snacc isn't open at your campus yet. We'll email ama@example.com the moment it is."
    )
  })
})
