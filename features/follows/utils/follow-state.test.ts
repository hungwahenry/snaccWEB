import { describe, expect, it } from "vitest"
import { followButtonLabel, nextFollowState } from "./follow-state"

describe("nextFollowState", () => {
  it("follows a public account and asks a private one", () => {
    expect(nextFollowState("none", false)).toBe("following")
    expect(nextFollowState("none", true)).toBe("requested")
  })

  it("undoes either a follow or a request", () => {
    expect(nextFollowState("following", true)).toBe("none")
    expect(nextFollowState("requested", true)).toBe("none")
  })
})

describe("followButtonLabel", () => {
  it("says where you stand", () => {
    expect(followButtonLabel("following", false)).toBe("Following")
    expect(followButtonLabel("requested", true)).toBe("Requested")
    expect(followButtonLabel("none", true)).toBe("Follow back")
    expect(followButtonLabel("none", false)).toBe("Follow")
  })
})
