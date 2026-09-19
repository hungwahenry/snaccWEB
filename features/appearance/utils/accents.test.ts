import { describe, expect, it } from "vitest"
import {
  ACCENTS,
  formatSavedAccent,
  INK,
  NO_ACCENT,
  parseSavedAccent,
  wornBy,
} from "./accents"

const colour = ACCENTS.find((accent) => accent.key !== INK.key) ?? INK

describe("saved accents", () => {
  it("reads a colour and the account that picked it", () => {
    expect(parseSavedAccent(`${colour.key}:user-1`)).toEqual({
      key: colour.key,
      owner: "user-1",
    })
  })

  it("reads an older value that named no account", () => {
    expect(parseSavedAccent(colour.key)).toEqual({
      key: colour.key,
      owner: null,
    })
  })

  it("falls back to the default for nothing, or a colour that no longer exists", () => {
    expect(parseSavedAccent(null)).toEqual(NO_ACCENT)
    expect(parseSavedAccent("retired-colour:user-1").key).toBe(INK.key)
  })

  it("writes back what it reads", () => {
    const saved = { key: colour.key, owner: "user-1" }
    expect(parseSavedAccent(formatSavedAccent(saved))).toEqual(saved)
    expect(formatSavedAccent({ key: colour.key, owner: null })).toBe(colour.key)
  })
})

describe("wornBy", () => {
  const saved = { key: colour.key, owner: "user-1" }

  it("gives the account that picked a colour its colour back", () => {
    expect(wornBy(saved, "user-1").key).toBe(colour.key)
  })

  it("never dresses another account, or nobody, in it", () => {
    expect(wornBy(saved, "user-2").key).toBe(INK.key)
    expect(wornBy(saved, null).key).toBe(INK.key)
  })

  it("lets whoever is signed in keep a colour saved before accounts were recorded", () => {
    expect(wornBy({ key: colour.key, owner: null }, "user-2").key).toBe(
      colour.key
    )
  })
})
