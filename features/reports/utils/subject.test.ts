import { describe, expect, it } from "vitest"
import type { SnaccAuthor } from "@/features/snaccs/types"
import { reportSubject, reportTitle } from "./subject"

const bola = {
  id: "u1",
  username: "bola",
  display_name: "Bola",
  avatar_url: "",
} as SnaccAuthor

describe("reportSubject", () => {
  it("says what each kind of report was about and where to find it", () => {
    expect(
      reportSubject({
        type: "snacc",
        snacc: { id: "s1", body: "hi", author: bola },
      })
    ).toMatchObject({ what: "hi", href: "/snacc/s1" })
    expect(
      reportSubject({
        type: "snacc",
        snacc: { id: "s1", body: null, author: bola },
      }).what
    ).toBe("A snacc")
    expect(reportSubject({ type: "user", user: bola })).toMatchObject({
      what: "@bola",
      href: "/@bola",
    })
    expect(
      reportSubject({
        type: "message",
        message: { id: "m1", conversation_id: "c1" },
        user: bola,
      })
    ).toMatchObject({ what: "A message in your DMs", href: "/messages/c1" })
    expect(
      reportSubject({
        type: "chat_message",
        chat_message: { id: "m1", room_id: "r1" },
        user: bola,
      }).href
    ).toBe("/chat/r1")
    expect(
      reportSubject({ type: "moment", moment: { id: "mo1" }, user: bola }).what
    ).toBe("A moment by @bola")
  })
})

describe("reportTitle", () => {
  it("names the thing being reported", () => {
    expect(reportTitle(null)).toBe("Report")
    expect(reportTitle({ type: "user", id: "u1", username: "bola" })).toBe(
      "Report @bola"
    )
    expect(reportTitle({ type: "chat_message", id: "m1" })).toBe(
      "Report this message"
    )
  })
})
