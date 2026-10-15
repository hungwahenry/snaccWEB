import { describe, expect, it } from "vitest"
import { saveLabel } from "./labels"

describe("saveLabel", () => {
  it("says what pressing the button will do", () => {
    expect(saveLabel(false)).toBe("Save")
    expect(saveLabel(true)).toBe("Remove from saved")
  })
})
