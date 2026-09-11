import { describe, expect, it } from "vitest"
import { pageWindow } from "./pagination"

describe("pageWindow", () => {
  it("covers a middle page", () => {
    expect(pageWindow(2, 20, 97)).toEqual({ first: 21, last: 40, pages: 5 })
  })

  it("stops the last page at the total", () => {
    expect(pageWindow(5, 20, 97)).toEqual({ first: 81, last: 97, pages: 5 })
  })

  it("shows nothing for an empty list but still one page", () => {
    expect(pageWindow(1, 20, 0)).toEqual({ first: 0, last: 0, pages: 1 })
  })

  it("does not run past the total when a page is out of range", () => {
    expect(pageWindow(9, 20, 30)).toEqual({ first: 30, last: 30, pages: 2 })
  })
})
