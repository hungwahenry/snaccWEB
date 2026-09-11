import { describe, expect, it } from "vitest"
import { ApiError } from "@/lib/api/errors"
import { codeDigits, resendLabel, retryAfterSeconds, secondsUntil } from "./otp"

describe("codeDigits", () => {
  it("keeps only digits, up to the code's length", () => {
    expect(codeDigits("12 34-56", 6)).toBe("123456")
    expect(codeDigits("1234567", 6)).toBe("123456")
    expect(codeDigits("ab", 6)).toBe("")
  })
})

describe("secondsUntil", () => {
  it("rounds up and stops at zero", () => {
    expect(secondsUntil(10_000, 8_500)).toBe(2)
    expect(secondsUntil(10_000, 10_000)).toBe(0)
    expect(secondsUntil(10_000, 12_000)).toBe(0)
  })
})

describe("retryAfterSeconds", () => {
  it("reads the wait from a throttled request", () => {
    const throttled = new ApiError(429, "Please wait", "otp_throttled", {
      retry_after_seconds: 42,
    } as unknown as Record<string, string[]>)
    expect(retryAfterSeconds(throttled)).toBe(42)
  })

  it("has nothing to say about any other failure", () => {
    expect(retryAfterSeconds(new ApiError(422, "Bad email"))).toBeNull()
    expect(retryAfterSeconds(new Error("boom"))).toBeNull()
  })
})

describe("resendLabel", () => {
  it("counts down, then offers a new code", () => {
    expect(resendLabel(12)).toBe("Resend code in 12s")
    expect(resendLabel(0)).toBe("Resend code")
  })
})
