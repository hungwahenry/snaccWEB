import { beforeEach, describe, expect, it, vi } from "vitest"
import { ApiError } from "./api/errors"

const toast = vi.hoisted(() => {
  const fn = vi.fn(() => "toast-id") as ReturnType<typeof vi.fn> & {
    error: ReturnType<typeof vi.fn>
    success: ReturnType<typeof vi.fn>
    dismiss: ReturnType<typeof vi.fn>
  }
  fn.error = vi.fn()
  fn.success = vi.fn()
  fn.dismiss = vi.fn()
  return fn
})
const config = vi.hoisted(() => ({ current: undefined as unknown }))

vi.mock("sonner", () => ({ toast }))
vi.mock("@/features/config/utils/flag", () => ({
  cachedConfig: () => config.current,
}))

const { showError, showUndo } = await import("./feedback")

const limitError = () =>
  new ApiError(429, "You have hit the limit", "too_many_moments", {
    premium_limit: "moments.daily_limit",
  } as unknown as Record<string, string[]>)

describe("showError", () => {
  beforeEach(() => {
    toast.error.mockReset()
    config.current = undefined
  })

  it("shows the server's message", () => {
    showError(new ApiError(400, "Too long", null))
    expect(toast.error).toHaveBeenCalledWith("Too long", undefined)
  })

  it("offers Premium only when it would raise the limit", () => {
    config.current = {
      values: {},
      flags: { premium: true },
      upgrades: { "moments.daily_limit": 10 },
    }
    showError(limitError())
    const [, options] = toast.error.mock.calls[0]
    expect(options.action).toBeTruthy()
  })

  it("offers nothing while Premium is off", () => {
    config.current = {
      values: {},
      flags: { premium: false },
      upgrades: { "moments.daily_limit": 10 },
    }
    showError(limitError())
    expect(toast.error).toHaveBeenCalledWith(
      "You have hit the limit",
      undefined
    )
  })
})

describe("showUndo", () => {
  it("runs the undo once and takes the toast down", () => {
    const onUndo = vi.fn()
    showUndo("Hidden", onUndo)
    const [, options] = toast.mock.calls[0] as unknown as [
      string,
      { action: { onClick: () => void } },
    ]
    options.action.onClick()

    expect(onUndo).toHaveBeenCalledOnce()
    expect(toast.dismiss).toHaveBeenCalledWith("toast-id")
  })
})
