import { describe, expect, it } from "vitest"
import { denialReason } from "./permission"

describe("denialReason", () => {
  it("is null when the admin holds the permission or full access", () => {
    expect(
      denialReason(
        { all: false, keys: ["users.read"], limited_to: {} },
        "users.read"
      )
    ).toBeNull()
    expect(
      denialReason({ all: true, keys: [], limited_to: {} }, "users.delete")
    ).toBeNull()
  })

  it("names the missing permission in words otherwise", () => {
    expect(
      denialReason(
        { all: false, keys: [], limited_to: {} },
        "users.revoke_sessions"
      )
    ).toBe(
      "Your role doesn't include “Revoke sessions · Users”. Ask an owner if you need it."
    )
    expect(denialReason(undefined, "users.read")).toBe(
      "Your role doesn't include “Read · Users”. Ask an owner if you need it."
    )
  })
})
