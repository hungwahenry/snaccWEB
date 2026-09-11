import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { Paginated } from "@/lib/api/types"
import { makeTestClient, queryWrapper } from "@/test/query-wrapper"
import { useInfiniteList } from "./use-infinite-list"

type Row = { id: string }

const page = (n: number, ids: string[], last = 2): Paginated<Row> => ({
  items: ids.map((id) => ({ id })),
  page: n,
  last_page: last,
  per_page: 2,
  total: 3,
})

describe("useInfiniteList", () => {
  it("loads pages in turn and drops repeats between them", async () => {
    const fetchPage = vi.fn((n: number) =>
      Promise.resolve(n === 1 ? page(1, ["a", "b"]) : page(2, ["b", "c"]))
    )
    const { result } = renderHook(
      () => useInfiniteList<Row>(["rows"], fetchPage),
      { wrapper: queryWrapper(makeTestClient()) }
    )

    await waitFor(() => expect(result.current.items).toHaveLength(2))
    expect(result.current.hasMore).toBe(true)

    act(() => result.current.loadMore())
    await waitFor(() =>
      expect(result.current.items.map((row) => row.id)).toEqual(["a", "b", "c"])
    )
    expect(result.current.hasMore).toBe(false)
    expect(result.current.total).toBe(3)
  })

  it("waits while disabled", () => {
    const fetchPage = vi.fn()
    renderHook(
      () => useInfiniteList<Row>(["rows"], fetchPage, { enabled: false }),
      { wrapper: queryWrapper(makeTestClient()) }
    )
    expect(fetchPage).not.toHaveBeenCalled()
  })

  it("says when a page failed", async () => {
    const { result } = renderHook(
      () =>
        useInfiniteList<Row>(["rows"], () => Promise.reject(new Error("x"))),
      { wrapper: queryWrapper(makeTestClient()) }
    )
    await waitFor(() => expect(result.current.failed).toBe(true))
  })
})
