import { parseAsString, parseAsStringLiteral } from "nuqs"
import { describe, expect, it } from "vitest"
import { booleanFilter, isFiltered } from "./list-params"

const filters = {
  q: parseAsString.withDefault(""),
  status: parseAsStringLiteral(["open", "closed"]),
  sort: parseAsStringLiteral(["new", "old"]).withDefault("new"),
}

describe("isFiltered", () => {
  it("is false while every filter sits on its default", () => {
    expect(isFiltered(filters, { q: "", status: null, sort: "new" })).toBe(
      false
    )
  })

  it("notices a search, a chosen value or a moved default", () => {
    expect(isFiltered(filters, { q: "bola", status: null, sort: "new" })).toBe(
      true
    )
    expect(isFiltered(filters, { q: "", status: "open", sort: "new" })).toBe(
      true
    )
    expect(isFiltered(filters, { q: "", status: null, sort: "old" })).toBe(true)
  })

  it("ignores the page", () => {
    expect(
      isFiltered(filters, { page: 4, q: "", status: null, sort: "new" })
    ).toBe(false)
  })
})

describe("booleanFilter", () => {
  it("maps a choice to true, false or no filter", () => {
    expect(booleanFilter("removed", "removed")).toBe(true)
    expect(booleanFilter<"live" | "removed">("live", "removed")).toBe(false)
    expect(booleanFilter(null, "removed")).toBeUndefined()
  })
})
