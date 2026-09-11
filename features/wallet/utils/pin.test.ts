import { describe, expect, it } from "vitest"
import { pinDots, pinEntered, typePin } from "./pin"

describe("pinEntered", () => {
  it("asks for the PIN a second time", () => {
    expect(pinEntered("enter", "", "123456")).toEqual({
      kind: "confirm",
      first: "123456",
    })
  })

  it("saves only a matching second entry", () => {
    expect(pinEntered("confirm", "123456", "123456")).toEqual({
      kind: "save",
      pin: "123456",
    })
    expect(pinEntered("confirm", "123456", "654321")).toEqual({
      kind: "mismatch",
      error: "Those did not match. Start again.",
    })
  })
})

describe("typePin", () => {
  it("takes digits up to six", () => {
    const typed = ["1", "2", "3", "4", "5", "6", "7"].reduce(typePin, "")
    expect(typed).toBe("123456")
  })

  it("deletes and ignores anything that is not a digit", () => {
    expect(typePin("12", "back")).toBe("1")
    expect(typePin("12", ".")).toBe("12")
  })
})

describe("pinDots", () => {
  it("fills a dot per digit", () => {
    expect(pinDots("12")).toEqual([true, true, false, false, false, false])
  })
})
