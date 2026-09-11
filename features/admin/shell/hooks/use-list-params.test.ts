import { act, renderHook, waitFor } from "@testing-library/react"
import { parseAsString, parseAsStringLiteral } from "nuqs"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { describe, expect, it } from "vitest"
import { useListParams } from "./use-list-params"

const FILTERS = {
  q: parseAsString.withDefault(""),
  status: parseAsStringLiteral(["open", "closed"]),
}

function setup(searchParams = "") {
  return renderHook(() => useListParams(FILTERS), {
    wrapper: withNuqsTestingAdapter({ searchParams, hasMemory: true }),
  })
}

describe("useListParams", () => {
  it("reads the page and filters from the URL", () => {
    const { result } = setup("?page=3&status=open")

    expect(result.current.values).toMatchObject({
      page: 3,
      q: "",
      status: "open",
    })
    expect(result.current.filtered).toBe(true)
  })

  it("goes back to page one whenever a filter changes", async () => {
    const { result } = setup("?page=4")

    act(() => result.current.setFilter({ status: "closed" }))

    await waitFor(() =>
      expect(result.current.values).toMatchObject({
        page: 1,
        status: "closed",
      })
    )
  })

  it("moves between pages without touching the filters", async () => {
    const { result } = setup("?status=open")

    act(() => result.current.setPage(2))

    await waitFor(() =>
      expect(result.current.values).toMatchObject({ page: 2, status: "open" })
    )
  })

  it("clears everything on reset", async () => {
    const { result } = setup("?page=2&q=bola&status=open")

    act(() => result.current.reset())

    await waitFor(() =>
      expect(result.current.values).toEqual({ page: 1, q: "", status: null })
    )
    expect(result.current.filtered).toBe(false)
  })

  it("holds the search back from the query until typing settles", async () => {
    const { result } = setup()

    act(() => result.current.setFilter({ q: "bo" }))

    expect(result.current.values.q).toBe("bo")
    expect(result.current.query.q).toBe("")
    await waitFor(() => expect(result.current.query.q).toBe("bo"))
  })
})
