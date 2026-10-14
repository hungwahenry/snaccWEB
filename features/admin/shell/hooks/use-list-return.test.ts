import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useListReturn, useRememberLists } from "./use-list-return"

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("page=2&status=open"),
}))

describe("useListReturn", () => {
  it("returns to a list with the filters it was left on", () => {
    renderHook(() => useRememberLists("/admin/reports"))

    const { result } = renderHook(() => useListReturn("/admin/reports"))

    expect(result.current).toBe("/admin/reports?page=2&status=open")
  })

  it("returns to a list it hasn't seen as it is", () => {
    const { result } = renderHook(() => useListReturn("/admin/snaccs"))

    expect(result.current).toBe("/admin/snaccs")
  })
})
