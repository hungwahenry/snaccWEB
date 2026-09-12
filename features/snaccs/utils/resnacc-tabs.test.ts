import { describe, expect, it } from "vitest"
import { resnaccTabs } from "./resnacc-tabs"

describe("resnaccTabs", () => {
  it("names both lists before the counts arrive", () => {
    expect(resnaccTabs().map((tab) => tab.label)).toEqual([
      "Quotes",
      "Resnaccs",
    ])
  })

  it("adds each count once it is known", () => {
    expect(
      resnaccTabs({ quotes: 3, plain: 12 }).map((tab) => tab.label)
    ).toEqual(["Quotes 3", "Resnaccs 12"])
  })
})
