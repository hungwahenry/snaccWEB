import { describe, expect, it } from "vitest"
import { authorNameOf, handleOf, nameOf } from "./names"

describe("nameOf", () => {
  it("prefers the display name, then the username, then the fallback", () => {
    expect(nameOf({ display_name: "Bola", username: "bola" })).toBe("Bola")
    expect(nameOf({ display_name: null, username: "bola" })).toBe("bola")
    expect(nameOf({ display_name: "", username: "bola" })).toBe("bola")
    expect(nameOf({ display_name: null, username: null })).toBe("Someone")
    expect(nameOf({ display_name: null, username: null }, "They")).toBe("They")
  })
})

describe("handleOf", () => {
  it("writes a username as a handle and has none without one", () => {
    expect(handleOf({ username: "bola" })).toBe("@bola")
    expect(handleOf({ username: null })).toBeNull()
  })
})

describe("authorNameOf", () => {
  it("hides the author of anything anonymous", () => {
    const bola = { display_name: "Bola", username: "bola" }
    expect(authorNameOf(bola, true)).toBe("Ghost")
    expect(authorNameOf(bola, false)).toBe("Bola")
  })
})
