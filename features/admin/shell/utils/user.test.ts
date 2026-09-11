import { describe, expect, it } from "vitest"
import { userHandle, userInitialSource, userName } from "./user"

describe("userName", () => {
  it("prefers the display name, then the handle, then the email", () => {
    expect(userName({ username: "bola", display_name: "Bola A" })).toBe(
      "Bola A"
    )
    expect(userName({ username: "bola", display_name: "  " })).toBe("@bola")
    expect(userName({ username: null, email: "b@x.ng" })).toBe("b@x.ng")
    expect(userName({ username: null })).toBe("Unnamed")
  })
})

describe("userHandle", () => {
  it("shows the handle or says there is none", () => {
    expect(userHandle({ username: "bola" })).toBe("@bola")
    expect(userHandle({ username: null, email: "b@x.ng" })).toBe("b@x.ng")
    expect(userHandle({ username: null })).toBe("No username")
  })
})

describe("userInitialSource", () => {
  it("never comes back empty", () => {
    expect(userInitialSource({ username: null, display_name: null })).toBe("?")
    expect(userInitialSource({ username: "bola" })).toBe("bola")
  })
})
