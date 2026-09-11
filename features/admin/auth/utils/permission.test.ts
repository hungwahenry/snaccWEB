import { describe, expect, it } from "vitest"
import { denialReason } from "./permission"

describe("denialReason", () => {
  it("is null when the admin holds the permission or full access", () => {
    expect(
      denialReason(
        { all: false, keys: ["users.read"], campuses: [] },
        "users.read"
      )
    ).toBeNull()
    expect(
      denialReason({ all: true, keys: [], campuses: [] }, "users.delete")
    ).toBeNull()
  })

  it("names the missing permission otherwise", () => {
    expect(
      denialReason({ all: false, keys: [], campuses: [] }, "users.delete")
    ).toBe('You need the "users.delete" permission.')
    expect(denialReason(undefined, "users.read")).toBe(
      'You need the "users.read" permission.'
    )
  })
})
