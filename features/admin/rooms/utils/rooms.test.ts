import { describe, expect, it } from "vitest"
import { messageStates, roomPlace } from "./rooms"

const names = new Map([["NG", "Nigeria"]])

describe("roomPlace", () => {
  it("names the campus, or who a country room is for", () => {
    expect(
      roomPlace(
        {
          kind: "campus",
          country_code: null,
          campus: { id: "u1", name: "University of Lagos", acronym: "UNILAG" },
        },
        names
      )
    ).toBe("University of Lagos (UNILAG)")
    expect(
      roomPlace({ kind: "country", country_code: "NG", campus: null }, names)
    ).toBe("Everyone at a campus in Nigeria")
    expect(
      roomPlace({ kind: "country", country_code: "GH", campus: null }, names)
    ).toBe("Everyone at a campus in GH")
  })
})

describe("messageStates", () => {
  it("shows held only while the message is still up", () => {
    expect(
      messageStates({ held_at: "x", deleted_at: null, deleted_by: null })
    ).toEqual([{ label: "Held", variant: "outline" }])
    expect(
      messageStates({ held_at: "x", deleted_at: "y", deleted_by: "moderator" })
    ).toEqual([{ label: "Removed", variant: "destructive" }])
    expect(
      messageStates({ held_at: null, deleted_at: "y", deleted_by: "sender" })
    ).toEqual([{ label: "Withdrawn by sender", variant: "destructive" }])
    expect(
      messageStates({ held_at: null, deleted_at: null, deleted_by: null })
    ).toEqual([])
  })
})
