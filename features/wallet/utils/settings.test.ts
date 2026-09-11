import { describe, expect, it } from "vitest"
import { mutedCountLabel, requestPrivacyLabel } from "./settings"

describe("money settings copy", () => {
  it("labels who can ask", () => {
    expect(requestPrivacyLabel("following")).toBe("People you follow")
    expect(requestPrivacyLabel("nobody")).toBe("No one")
  })

  it("says none rather than zero", () => {
    expect(mutedCountLabel(0)).toBe("None")
    expect(mutedCountLabel(3)).toBe("3")
  })
})
