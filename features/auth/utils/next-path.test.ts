import { describe, expect, it } from "vitest"
import { safeNextPath } from "./next-path"

describe("safeNextPath", () => {
  it("keeps a path on this site", () => {
    expect(safeNextPath("/@ada")).toBe("/@ada")
    expect(safeNextPath("/messages/new?targetId=1")).toBe(
      "/messages/new?targetId=1"
    )
  })

  it("sends anything else home", () => {
    expect(safeNextPath(undefined)).toBe("/home")
    expect(safeNextPath("https://evil.example")).toBe("/home")
    expect(safeNextPath("//evil.example")).toBe("/home")
    expect(safeNextPath("/\\evil.example")).toBe("/home")
  })
})
