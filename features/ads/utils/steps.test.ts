import { describe, expect, it } from "vitest"
import {
  firstProblem,
  nextStep,
  previousStep,
  stepLabel,
  stepOf,
  stepReady,
} from "./steps"

describe("promotion steps", () => {
  it("walks forwards and backwards through the four steps", () => {
    expect(nextStep("audience")).toBe("placement")
    expect(nextStep("budget")).toBe("review")
    expect(nextStep("review")).toBeNull()
    expect(previousStep("placement")).toBe("audience")
    expect(previousStep("audience")).toBeNull()
  })

  it("says where it is", () => {
    expect(stepLabel("placement")).toBe("Step 2 of 4 · Where it shows")
  })

  it("sends a refused field back to the step that owns it", () => {
    expect(stepOf("audience")).toBe("audience")
    expect(stepOf("button")).toBe("placement")
    expect(stepOf("budget")).toBe("budget")
    expect(stepOf("general")).toBe("review")
  })

  it("holds a step back only on its own problems", () => {
    const problems = { budget: "Too small." }
    expect(stepReady("audience", problems, 0)).toBe(true)
    expect(stepReady("budget", problems, 50_000)).toBe(false)
  })

  it("needs a budget before leaving the budget step", () => {
    expect(stepReady("budget", {}, 0)).toBe(false)
    expect(stepReady("budget", {}, 200_000)).toBe(true)
  })

  it("names the first thing in the way, in step order", () => {
    expect(firstProblem({})).toBeNull()
    expect(
      firstProblem({ budget: "Too small.", audience: "Too narrow." })
    ).toBe("Too narrow.")
    expect(firstProblem({ general: "Not yours." })).toBe("Not yours.")
  })
})
