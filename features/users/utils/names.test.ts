import { describe, expect, it } from "vitest"
import { handleOf, nameOf, usernameOf } from "./names"

describe("nameOf", () => {
  it("prefers the display name, then the username, then the fallback", () => {
    expect(nameOf({ display_name: "Bola", username: "bola" })).toBe("Bola")
    expect(nameOf({ display_name: null, username: "bola" })).toBe("bola")
    expect(nameOf({ display_name: "", username: "bola" })).toBe("bola")
    expect(nameOf({ display_name: null, username: null })).toBe("Someone")
    expect(nameOf({ display_name: null, username: null }, "They")).toBe("They")
  })
})

describe("usernameOf", () => {
  it("leads with the username, falling back the same way", () => {
    expect(usernameOf({ display_name: "Bola", username: "bola" })).toBe("bola")
    expect(usernameOf({ display_name: "Bola", username: null })).toBe("Bola")
    expect(usernameOf({ display_name: null, username: null })).toBe("Someone")
  })
})

describe("handleOf", () => {
  it("writes a username as a handle and has none without one", () => {
    expect(handleOf({ username: "bola" })).toBe("@bola")
    expect(handleOf({ username: null })).toBeNull()
  })
})
