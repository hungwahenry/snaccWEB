import { describe, expect, it } from "vitest"
import { usernameFromPayCode } from "./scanned-pay-code"

describe("usernameFromPayCode", () => {
  it("reads who to pay from a pay link", () => {
    expect(usernameFromPayCode("https://snacc.fyi/pay/ada_l")).toBe("ada_l")
    expect(usernameFromPayCode("https://snacc.fyi/pay/ada.l?amount=500")).toBe(
      "ada.l"
    )
  })

  it("reads who to pay from the app's own link", () => {
    expect(usernameFromPayCode("snacc://pay?to=ada_l")).toBe("ada_l")
    expect(usernameFromPayCode("snacc://pay?amount=500&to=ada_l")).toBe(
      "ada_l"
    )
  })

  it("ignores a code that is not a pay code", () => {
    expect(usernameFromPayCode("https://snacc.fyi/profile/ada_l")).toBeNull()
    expect(usernameFromPayCode("https://evil.example/pay/ada_l")).toBeNull()
    expect(
      usernameFromPayCode("https://snacc.fyi.evil.example/pay/ada_l")
    ).toBeNull()
    expect(usernameFromPayCode("hello")).toBeNull()
  })
})
