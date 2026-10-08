import { describe, expect, it } from "vitest"
import { pollChoice } from "./polls"

describe("pollChoice", () => {
  it("names the option being voted for, only on that snacc's poll", () => {
    const vote = { snaccId: "s1", optionId: "o2" }
    expect(pollChoice(vote, "s1")).toBe("o2")
    expect(pollChoice(vote, "s2")).toBeNull()
    expect(pollChoice(null, "s1")).toBeNull()
  })
})
