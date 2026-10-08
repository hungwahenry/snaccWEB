import { describe, expect, it } from "vitest"
import type { Conversation } from "../types"
import { anonymityNote, safetyActions } from "./safety"

const conversation = (overrides: Partial<Conversation>): Conversation =>
  ({
    can_reveal: false,
    you_are_ghost: false,
    revealed: false,
    blocked: false,
    other: { id: "u1" },
    ...overrides,
  }) as Conversation

describe("safetyActions", () => {
  it("offers the reveal only to a hidden ghost, and block only to the target", () => {
    expect(
      safetyActions(conversation({ can_reveal: true, you_are_ghost: true }))
    ).toEqual(["reveal", "report"])
    expect(safetyActions(conversation({}))).toEqual(["report", "block"])
    expect(safetyActions(conversation({ blocked: true }))).toEqual([
      "report",
      "unblock",
    ])
  })

  it("cannot report someone it cannot name", () => {
    expect(
      safetyActions(
        conversation({ other: { id: "" } as Conversation["other"] })
      )
    ).toEqual(["block"])
  })
})

describe("anonymityNote", () => {
  it("tells each side who is hidden until the reveal", () => {
    expect(anonymityNote(conversation({ you_are_ghost: true }))).toBe(
      "You're anonymous to them."
    )
    expect(anonymityNote(conversation({}))).toBe(
      "They're anonymous until they reveal themselves."
    )
    expect(anonymityNote(conversation({ revealed: true }))).toBeNull()
  })
})
