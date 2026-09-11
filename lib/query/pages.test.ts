import type { InfiniteData } from "@tanstack/react-query"
import { describe, expect, it } from "vitest"
import type { Paginated } from "../api/types"
import {
  allItems,
  appendItem,
  filterItems,
  findItem,
  firstPageOnly,
  mapItems,
  prependItem,
  uniqueById,
} from "./pages"

type Row = { id: string; n: number }

const pages: InfiniteData<Paginated<Row>, number> = {
  pages: [
    {
      items: [
        { id: "a", n: 1 },
        { id: "b", n: 2 },
      ],
      page: 1,
      last_page: 2,
      per_page: 2,
      total: 3,
    },
    {
      items: [{ id: "c", n: 3 }],
      page: 2,
      last_page: 2,
      per_page: 2,
      total: 3,
    },
  ],
  pageParams: [1, 2],
}

describe("page helpers", () => {
  it("reads every item in order", () => {
    expect(allItems(pages).map((row) => row.id)).toEqual(["a", "b", "c"])
    expect(allItems<Row, number>(undefined)).toEqual([])
  })

  it("finds an item on any page", () => {
    expect(findItem(pages, (row) => row.id === "c")).toEqual({ id: "c", n: 3 })
    expect(findItem(pages, (row) => row.id === "z")).toBeUndefined()
  })

  it("changes items without touching the paging", () => {
    const doubled = mapItems(pages, (row) => ({ ...row, n: row.n * 2 }))
    expect(allItems(doubled).map((row) => row.n)).toEqual([2, 4, 6])
    expect(doubled?.pageParams).toEqual([1, 2])
  })

  it("removes items and lowers the total to match", () => {
    const kept = filterItems(pages, (row) => row.id !== "b")
    expect(allItems(kept).map((row) => row.id)).toEqual(["a", "c"])
    expect(kept?.pages[0].total).toBe(2)
  })

  it("adds to the top of the first page or the end of the last", () => {
    const top = prependItem(pages, { id: "z", n: 0 })
    expect(top?.pages[0].items[0].id).toBe("z")
    expect(top?.pages[0].total).toBe(4)

    const end = appendItem(pages, { id: "y", n: 9 })
    expect(end?.pages[1].items.at(-1)?.id).toBe("y")
  })

  it("leaves a list that is not loaded alone", () => {
    expect(prependItem<Row, number>(undefined, { id: "z", n: 0 })).toBe(
      undefined
    )
    expect(filterItems<Row, number>(undefined, () => true)).toBe(undefined)
  })

  it("keeps only the first page for a refresh", () => {
    expect(firstPageOnly(pages)?.pages).toHaveLength(1)
    expect(firstPageOnly(pages)?.pageParams).toEqual([1])
  })

  it("drops repeats that paging can produce", () => {
    expect(uniqueById([{ id: "a" }, { id: "b" }, { id: "a" }])).toEqual([
      { id: "a" },
      { id: "b" },
    ])
    expect(uniqueById([1, 1])).toEqual([1, 1])
  })
})
