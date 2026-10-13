import { describe, expect, it } from "vitest"
import { AGREE_PATH } from "@/features/legal/routes"
import { COMPLETE_PROFILE_PATH } from "@/features/onboarding/routes"
import { SUSPENDED_PATH } from "@/features/suspensions/routes"
import type { User } from "@/features/users/types"
import { ApiError } from "@/lib/api/errors"
import { gatePath } from "./gate"

const failed = (error: Error, data?: User) => ({ isError: true, error, data })

const loaded = (completedAt: string | null) => ({
  isError: false,
  error: null,
  data: { profile: { completed_at: completedAt } } as User,
})

describe("gatePath", () => {
  it("sends a signed-out visit to log in, and back afterwards", () => {
    expect(gatePath(failed(new ApiError(401, "Who?")), "/snacc/1")).toBe(
      "/login?next=%2Fsnacc%2F1"
    )
  })

  it("holds an account where its state says", () => {
    expect(
      gatePath(failed(new ApiError(403, "No", "account_suspended")), "/")
    ).toBe(SUSPENDED_PATH)
    expect(
      gatePath(
        failed(new ApiError(403, "Agree", "legal_agreement_required")),
        "/"
      )
    ).toBe(AGREE_PATH)
  })

  it("finishes sign-up first, and lets everyone else in", () => {
    expect(gatePath(loaded(null), "/")).toBe(COMPLETE_PROFILE_PATH)
    expect(gatePath(failed(new Error("offline"), loaded(null).data), "/")).toBe(
      COMPLETE_PROFILE_PATH
    )
    expect(gatePath(loaded("2026-10-13T00:00:00.000Z"), "/")).toBeNull()
    expect(gatePath(failed(new Error("offline")), "/")).toBeNull()
  })
})
