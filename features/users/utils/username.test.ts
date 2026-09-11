import { describe, expect, it } from "vitest"
import {
  normalizeUsername,
  usernameMessage,
  usernameProblem,
  usernameStatus,
} from "./username"

const base = {
  typed: "ada",
  settled: "ada",
  current: "",
  valid: true,
  checking: false,
}

describe("username rules", () => {
  it("keeps only what a username can hold", () => {
    expect(normalizeUsername("Ada Love-lace_1")).toBe("adalovelace_1")
  })

  it("says what is wrong with a username", () => {
    expect(usernameProblem("ad", 30)).toBe("At least 3 characters.")
    expect(usernameProblem("a".repeat(31), 30)).toBe("At most 30 characters.")
    expect(usernameProblem("a".repeat(20), 15)).toBe("At most 15 characters.")
    expect(usernameProblem("1ada", 30)).toMatch(/Start with a letter/)
    expect(usernameProblem("_ada", 30)).toMatch(/Start with a letter/)
    expect(usernameProblem("ada_1", 30)).toBeNull()
  })
})

describe("usernameStatus", () => {
  it("treats your own username as available", () => {
    expect(usernameStatus({ ...base, current: "ada", available: false })).toBe(
      "available"
    )
  })

  it("waits for typing to settle and the check to land", () => {
    expect(usernameStatus({ ...base, typed: "adal", available: true })).toBe(
      "checking"
    )
    expect(usernameStatus({ ...base, checking: true, available: true })).toBe(
      "checking"
    )
    expect(usernameStatus({ ...base, available: undefined })).toBe("checking")
    expect(usernameStatus({ ...base, available: true })).toBe("available")
    expect(usernameStatus({ ...base, available: false })).toBe("taken")
  })

  it("says idle when empty and invalid before asking the server", () => {
    expect(usernameStatus({ ...base, typed: "", available: undefined })).toBe(
      "idle"
    )
    expect(
      usernameStatus({ ...base, valid: false, available: undefined })
    ).toBe("invalid")
  })
})

describe("usernameMessage", () => {
  it("explains an unusable username and says nothing otherwise", () => {
    expect(usernameMessage("invalid", "At least 3 characters.")).toBe(
      "At least 3 characters."
    )
    expect(usernameMessage("taken", null)).toBe("That one is taken.")
    expect(usernameMessage("available", null)).toBeNull()
    expect(usernameMessage("checking", null)).toBeNull()
  })
})
