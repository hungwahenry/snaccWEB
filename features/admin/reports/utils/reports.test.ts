import { describe, expect, it } from "vitest"
import { DAY_MS } from "@/lib/duration"
import type { ReportAuthor, ReportTarget } from "../types"
import {
  actChoices,
  describeTarget,
  EMPTY_RESOLVE,
  messageThreadId,
  reporterName,
  resolvedLine,
  reviewerName,
  scoredCategories,
  suspends,
  targetNoun,
  targetSummary,
  targetThumb,
  toggleAct,
  toResolveInput,
} from "./reports"

const person = (
  username: string | null,
  display_name: string | null = null
): ReportAuthor => ({
  id: `id-${username}`,
  username,
  display_name,
  avatar_url: "",
  university: null,
})

const nothing = { images: [], sticker: null, gif: null }

const roomMessage: ReportTarget = {
  type: "chat_message",
  chat_message: {
    id: "c1",
    body: "hello room",
    deleted_at: null,
    created_at: "2026-09-01T00:00:00Z",
    ...nothing,
    sender: person("bola"),
    room: { id: "r1", name: "UNILAG", campus: null },
  },
}

const snacc = (body: string | null, media = nothing): ReportTarget => ({
  type: "snacc",
  snacc: { id: "s1", body, deleted_at: null, author: person("ada"), ...media },
})

const ghostMessage: ReportTarget = {
  type: "message",
  message: {
    id: "m1",
    body: "",
    deleted_at: null,
    created_at: "2026-09-01T00:00:00Z",
    ...nothing,
    sender: person("ghost"),
    conversation: {
      id: "t1",
      pseudonym: "Moon",
      revealed: false,
      ghost: person("ghost"),
      target: person("ada"),
    },
  },
}

describe("describeTarget", () => {
  it("names a room message with its sender and room", () => {
    expect(describeTarget(roomMessage)).toEqual({
      title: "hello room",
      who: "@bola in UNILAG",
    })
  })

  it("falls back to what the target is when it has no text", () => {
    expect(describeTarget(snacc(null)).title).toBe("Media snacc")
    expect(describeTarget(ghostMessage).title).toBe("Ghost message")
    expect(describeTarget({ type: "user", user: person("ada") })).toEqual({
      title: "The account itself",
      who: "@ada",
    })
  })

  it("cuts long text short", () => {
    expect(describeTarget(snacc("x".repeat(100))).title).toHaveLength(60)
  })

  it("says when the target is gone", () => {
    expect(describeTarget(null)).toEqual({ title: "Target is gone", who: "—" })
  })
})

describe("targetThumb", () => {
  it("picks the first image, then a gif, then a sticker", () => {
    expect(
      targetThumb(
        snacc(null, {
          images: [{ url: "a.jpg" }],
          gif: { url: "b.gif" },
          sticker: null,
        } as never)
      )
    ).toBe("a.jpg")
    expect(
      targetThumb(snacc(null, { ...nothing, gif: { url: "b.gif" } } as never))
    ).toBe("b.gif")
  })

  it("has nothing for an account or a missing target", () => {
    expect(targetThumb({ type: "user", user: person("ada") })).toBeNull()
    expect(targetThumb(null)).toBeNull()
    expect(targetThumb(roomMessage)).toBeNull()
  })
})

describe("names", () => {
  it("credits the automatic check to Snacc", () => {
    expect(reporterName({ reporter: null })).toBe("Snacc")
    expect(reporterName({ reporter: person("ada") })).toBe("@ada")
  })

  it("shows who resolved a report", () => {
    expect(reviewerName({ reviewed_by: person("mod") })).toBe("@mod")
    expect(reviewerName({ reviewed_by: null })).toBe("resolved")
    expect(resolvedLine({ reviewed_by: null, reviewed_at: null })).toBeNull()
    expect(resolvedLine({ reviewed_by: person(null), reviewed_at: null })).toBe(
      "Resolved by an admin"
    )
    expect(
      resolvedLine({
        reviewed_by: person("mod"),
        reviewed_at: "2026-09-01T10:00:00Z",
      })
    ).toMatch(/^Resolved by mod on /)
  })

  it("says what the report was filed against", () => {
    expect(targetSummary(roomMessage)).toBe("Filed against a room message.")
    expect(targetSummary(null)).toBe("The reported thing no longer exists.")
    expect(targetNoun(roomMessage)).toBe("room message")
    expect(targetNoun(null)).toBe("target")
  })

  it("finds the thread only for a ghost message", () => {
    expect(messageThreadId(ghostMessage)).toBe("t1")
    expect(messageThreadId(roomMessage)).toBeNull()
  })
})

describe("acts", () => {
  it("offers what fits the target", () => {
    expect(actChoices(roomMessage).map((choice) => choice.value)).toEqual([
      "delete_chat_message",
      "suspend_sender",
    ])
    expect(actChoices(null)).toEqual([])
  })

  it("knows which acts suspend someone", () => {
    expect(suspends(["delete_snacc"])).toBe(false)
    expect(suspends(["delete_snacc", "suspend_author"])).toBe(true)
  })

  it("toggles an act on and off", () => {
    expect(toggleAct([], "delete_snacc")).toEqual(["delete_snacc"])
    expect(toggleAct(["delete_snacc"], "delete_snacc")).toEqual([])
  })
})

describe("toResolveInput", () => {
  const now = Date.parse("2026-09-10T12:00:00Z")

  it("sends only the outcome and the target when nothing else is picked", () => {
    expect(
      toResolveInput(
        snacc("hi"),
        { ...EMPTY_RESOLVE, status: "dismissed" },
        now
      )
    ).toEqual({ snaccId: "s1", status: "dismissed" })
  })

  it("carries the acts, the note and a suspension for a room message", () => {
    expect(
      toResolveInput(
        roomMessage,
        {
          status: "actioned",
          note: "  spam  ",
          acts: ["delete_chat_message", "suspend_sender"],
          suspension: { reasonId: "r1", days: "3" },
        },
        now
      )
    ).toEqual({
      chatMessageId: "c1",
      status: "actioned",
      note: "spam",
      acts: ["delete_chat_message", "suspend_sender"],
      suspension: {
        reasonId: "r1",
        until: new Date(now + 3 * DAY_MS).toISOString(),
      },
    })
  })

  it("leaves the suspension out unless an act suspends", () => {
    expect(
      toResolveInput(
        roomMessage,
        {
          ...EMPTY_RESOLVE,
          acts: ["delete_chat_message"],
          suspension: { reasonId: "r1", days: "3" },
        },
        now
      ).suspension
    ).toBeUndefined()
  })
})

describe("scoredCategories", () => {
  it("keeps what scored above zero, highest first", () => {
    expect(
      scoredCategories({ scores: { hate: 0.2, spam: 0.9, violence: 0 } })
    ).toEqual([
      ["spam", 0.9],
      ["hate", 0.2],
    ])
  })
})
