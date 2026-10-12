import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { batchQueue } from "./batch-queue"

describe("batchQueue", () => {
  const send = vi.fn<(batch: number[]) => Promise<void>>(() =>
    Promise.resolve()
  )
  const queue = batchQueue(send, 20)

  beforeEach(() => {
    vi.useFakeTimers()
    send.mockClear()
  })
  afterEach(() => {
    queue.flush()
    vi.useRealTimers()
  })

  it("sends what piled up after a short wait, in one batch", () => {
    queue.add(1)
    queue.add(2)
    expect(send).not.toHaveBeenCalled()

    vi.advanceTimersByTime(5000)
    expect(send).toHaveBeenCalledTimes(1)
    expect(send.mock.calls[0][0]).toEqual([1, 2])
  })

  it("never sends more than a batch at once", () => {
    for (let index = 0; index < 25; index += 1) queue.add(index)

    expect(send).toHaveBeenCalledTimes(1)
    expect(send.mock.calls[0][0]).toHaveLength(20)

    vi.advanceTimersByTime(5000)
    expect(send).toHaveBeenCalledTimes(2)
    expect(send.mock.calls[1][0]).toHaveLength(5)
  })
})
