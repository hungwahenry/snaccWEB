import { describe, expect, it } from "vitest"
import { ApiError, getErrorMessage, isNotFound, isSuspended } from "./errors"

const withErrors = (errors: Record<string, unknown>) =>
  new ApiError(422, "Validation failed", "validation_failed", errors as never)

describe("getErrorMessage", () => {
  it("prefers the first field message", () => {
    expect(getErrorMessage(withErrors({ body: ["Too long"] }))).toBe("Too long")
  })

  it("never shows the premium key the server adds next to the field", () => {
    expect(
      getErrorMessage(
        withErrors({ premium_limit: "moments.max_per_day", body: ["Too many"] })
      )
    ).toBe("Too many")
    expect(
      getErrorMessage(withErrors({ premium_limit: "moments.max_per_day" }))
    ).toBe("Validation failed")
  })

  it("falls back for things that are not errors", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom")
    expect(getErrorMessage("boom")).toBe("Something went wrong.")
  })
})

describe("error checks", () => {
  it("reads the status and code", () => {
    expect(isNotFound(new ApiError(404, "Gone"))).toBe(true)
    expect(isNotFound(new Error("Gone"))).toBe(false)
    expect(isSuspended(new ApiError(403, "No", "account_suspended"))).toBe(true)
  })
})
