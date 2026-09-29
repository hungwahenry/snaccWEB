import { describe, expect, it } from "vitest"
import { formatNumber } from "@/lib/format"
import { countColumn } from "./columns"

describe("countColumn", () => {
  it("right-aligns a formatted count read from the row", () => {
    const column = countColumn<{ members: number }>(
      "members",
      "Members",
      (row) => row.members
    )

    expect(column).toMatchObject({
      id: "members",
      header: "Members",
      align: "end",
    })
    expect(column.cell({ members: 1200 })).toBe(formatNumber(1200))
  })
})
