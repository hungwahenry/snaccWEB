import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useFeedSort } from "./use-feed-sort"

describe("useFeedSort", () => {
  it("starts from what was stored, then remembers a new pick for every reader", () => {
    window.localStorage.setItem("snacc_feed_sort", "latest")
    const first = renderHook(() => useFeedSort())
    const second = renderHook(() => useFeedSort())
    expect(first.result.current[0]).toBe("latest")

    act(() => first.result.current[1]("top"))

    expect(first.result.current[0]).toBe("top")
    expect(second.result.current[0]).toBe("top")
    expect(window.localStorage.getItem("snacc_feed_sort")).toBe("top")
  })
})
