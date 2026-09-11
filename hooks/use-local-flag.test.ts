import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { useLocalFlag } from "./use-local-flag"

describe("useLocalFlag", () => {
  beforeEach(() => window.localStorage.clear())

  it("remembers a one-off flag and tells every reader", () => {
    const first = renderHook(() => useLocalFlag("seen_intro"))
    const second = renderHook(() => useLocalFlag("seen_intro"))
    expect(first.result.current[0]).toBe(false)

    act(() => first.result.current[1]())

    expect(first.result.current[0]).toBe(true)
    expect(second.result.current[0]).toBe(true)
    expect(window.localStorage.getItem("seen_intro")).toBe("1")
  })
})
