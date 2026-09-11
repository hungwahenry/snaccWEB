import { describe, expect, it } from "vitest"
import { matchLine } from "./card"

const side = (name: string) => ({ name, crest: null })

describe("matchLine", () => {
  it("shows the score once there is one", () => {
    expect(
      matchLine({
        home: side("Arsenal"),
        away: side("Chelsea"),
        home_score: 2,
        away_score: 1,
      })
    ).toBe("Arsenal 2–1 Chelsea")
  })

  it("reads as a fixture before kickoff", () => {
    expect(
      matchLine({
        home: side("Arsenal"),
        away: side("Chelsea"),
        home_score: null,
        away_score: null,
      })
    ).toBe("Arsenal vs Chelsea")
  })
})
