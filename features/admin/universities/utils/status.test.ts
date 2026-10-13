import { describe, expect, it } from "vitest"
import type { AdminUniversity } from "../types"
import { addedBy, mergeTargets } from "./status"

const campus = (fields: Partial<AdminUniversity>): AdminUniversity =>
  ({
    id: "c",
    name: "Campus",
    acronym: "C",
    status: "verified",
    country: { code: "GH", name: "Ghana" },
    added_by: null,
    ...fields,
  }) as AdminUniversity

describe("mergeTargets", () => {
  it("offers every other campus not turned down, by name, with its country", () => {
    const copy = campus({ id: "copy", name: "Ug", status: "pending" })
    const options = mergeTargets(
      [
        copy,
        campus({ id: "ug", name: "University of Ghana", acronym: "UG" }),
        campus({ id: "ashesi", name: "Ashesi University", acronym: "AU" }),
        campus({ id: "gone", name: "Fake College", status: "rejected" }),
        campus({
          id: "abroad",
          name: "University of Lagos",
          country: { code: "NG", name: "Nigeria" },
        }),
      ],
      copy
    )

    expect(options).toEqual([
      { value: "ashesi", label: "Ashesi University (AU) · Ghana" },
      { value: "ug", label: "University of Ghana (UG) · Ghana" },
      { value: "abroad", label: "University of Lagos (C) · Nigeria" },
    ])
  })
})

describe("addedBy", () => {
  it("says who added a campus that is not verified yet", () => {
    expect(
      addedBy(
        campus({ status: "pending", added_by: { id: "u", username: "ama" } })
      )
    ).toBe("Added by @ama")
    expect(addedBy(campus({ status: "pending", added_by: null }))).toBe(
      "Added by someone who has left"
    )
    expect(addedBy(campus({ status: "verified" }))).toBeNull()
  })
})
