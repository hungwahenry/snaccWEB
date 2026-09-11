import { beforeEach, describe, expect, it, vi } from "vitest"

const feedback = vi.hoisted(() => ({
  onUndo: null as null | (() => void),
  dismiss: vi.fn(),
  showError: vi.fn(),
}))

vi.mock("./feedback", () => ({
  showError: feedback.showError,
  showUndo: (_message: string, onUndo: () => void) => {
    feedback.onUndo = onUndo
    return feedback.dismiss
  },
}))

const { commitWithUndo } = await import("./undoable")

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe("commitWithUndo", () => {
  beforeEach(() => {
    feedback.onUndo = null
    feedback.dismiss.mockReset()
    feedback.showError.mockReset()
  })

  it("keeps the change when nobody undoes it", async () => {
    const revert = vi.fn()
    const undo = vi.fn(() => Promise.resolve())
    commitWithUndo({
      message: "Hidden",
      commit: () => Promise.resolve(),
      revert,
      undo,
    })
    await flush()

    expect(revert).not.toHaveBeenCalled()
    expect(undo).not.toHaveBeenCalled()
  })

  it("puts it back and reverses the server change on Undo", async () => {
    const revert = vi.fn()
    const undo = vi.fn(() => Promise.resolve())
    commitWithUndo({
      message: "Hidden",
      commit: () => Promise.resolve(),
      revert,
      undo,
    })
    feedback.onUndo?.()
    await flush()

    expect(revert).toHaveBeenCalledOnce()
    expect(undo).toHaveBeenCalledOnce()
  })

  it("puts it back and says why when the server refuses", async () => {
    const revert = vi.fn()
    const failure = new Error("nope")
    commitWithUndo({
      message: "Hidden",
      commit: () => Promise.reject(failure),
      revert,
      undo: () => Promise.resolve(),
    })
    await flush()

    expect(feedback.dismiss).toHaveBeenCalledOnce()
    expect(revert).toHaveBeenCalledOnce()
    expect(feedback.showError).toHaveBeenCalledWith(failure)
  })

  it("stays quiet about a failure the person already undid", async () => {
    const revert = vi.fn()
    commitWithUndo({
      message: "Hidden",
      commit: () => Promise.reject(new Error("nope")),
      revert,
      undo: () => Promise.resolve(),
    })
    feedback.onUndo?.()
    await flush()

    expect(revert).toHaveBeenCalledOnce()
    expect(feedback.showError).not.toHaveBeenCalled()
  })
})
