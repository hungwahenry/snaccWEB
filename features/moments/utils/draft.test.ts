import { describe, expect, it } from "vitest"
import { momentContent } from "./draft"

describe("momentContent", () => {
  const draft = {
    hasWords: false,
    background: "#000000",
    image: null,
    sharing: null,
  }

  it("sends what each kind of moment needs, and nothing until it is complete", () => {
    expect(momentContent("text", draft)).toBeNull()
    expect(momentContent("text", { ...draft, hasWords: true })).toEqual({
      background: "#000000",
    })
    expect(momentContent("image", draft)).toBeNull()
    expect(
      momentContent("snacc", {
        ...draft,
        sharing: { snaccId: "s1", ready: false },
      })
    ).toBeNull()
    expect(
      momentContent("snacc", {
        ...draft,
        sharing: { snaccId: "s1", ready: true },
      })
    ).toEqual({ background: "#000000", snaccId: "s1" })
  })
})
