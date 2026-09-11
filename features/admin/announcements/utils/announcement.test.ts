import { describe, expect, it } from "vitest"
import {
  audienceLabel,
  EMPTY_DRAFT,
  isDraftReady,
  toCreateInput,
} from "./announcement"

describe("isDraftReady", () => {
  it("needs a title and a message", () => {
    expect(isDraftReady(EMPTY_DRAFT)).toBe(false)
    expect(isDraftReady({ ...EMPTY_DRAFT, title: "Hi", message: " " })).toBe(
      false
    )
    expect(isDraftReady({ ...EMPTY_DRAFT, title: "Hi", message: "Yo" })).toBe(
      true
    )
  })

  it("needs a campus when it goes to one campus", () => {
    const draft = {
      ...EMPTY_DRAFT,
      title: "Hi",
      message: "Yo",
      audience: "campus" as const,
    }
    expect(isDraftReady(draft)).toBe(false)
    expect(isDraftReady({ ...draft, universityId: "u1" })).toBe(true)
  })
})

describe("toCreateInput", () => {
  it("trims and only sends the campus for a campus announcement", () => {
    expect(
      toCreateInput({
        title: " Hi ",
        message: " Yo ",
        audience: "all",
        universityId: "u1",
      })
    ).toEqual({
      title: "Hi",
      message: "Yo",
      audience: "all",
      universityId: undefined,
    })
    expect(
      toCreateInput({
        title: "Hi",
        message: "Yo",
        audience: "campus",
        universityId: "u1",
      }).universityId
    ).toBe("u1")
  })
})

describe("audienceLabel", () => {
  const acronyms = new Map([["u1", "UNILAG"]])

  it("names everyone, a known campus, or an unknown one", () => {
    expect(audienceLabel(null, acronyms)).toBe("Everyone")
    expect(audienceLabel("u1", acronyms)).toBe("UNILAG")
    expect(audienceLabel("u2", acronyms)).toBe("One campus")
  })
})
