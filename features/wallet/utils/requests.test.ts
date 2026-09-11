import { ulid } from "ulid"
import { describe, expect, it } from "vitest"
import type { MoneyPerson, MoneyRequest } from "../types"
import {
  cancelTitle,
  cannotCoverMessage,
  declineTitle,
  estimatedRequestExpiry,
  isOpenRequest,
  mutedMessage,
  openRequests,
  requestCounterparty,
  requestHeadline,
  requestLine,
  requestState,
} from "./requests"

function person(username: string): MoneyPerson {
  return {
    id: username,
    username,
    display_name: null,
    avatar_url: "",
    university: null,
    score: { tier: null, og: false },
    official: false,
    premium: false,
    is_birthday: false,
  }
}

const NOW = Date.parse("2026-05-10T12:00:00Z")

const request: MoneyRequest = {
  id: "q1",
  amount: 250000,
  note: null,
  status: "pending",
  requester: person("ada"),
  target: person("obi"),
  expires_at: "2026-05-12T12:00:00Z",
  created_at: "2026-05-09T12:00:00Z",
  resolved_at: null,
}

describe("isOpenRequest", () => {
  it("is pending and not yet expired", () => {
    expect(isOpenRequest(request, NOW)).toBe(true)
    expect(
      isOpenRequest({ ...request, expires_at: "2026-05-10T11:00:00Z" }, NOW)
    ).toBe(false)
    expect(isOpenRequest({ ...request, status: "paid" }, NOW)).toBe(false)
    expect(
      openRequests([request, { ...request, status: "declined" }], NOW)
    ).toEqual([request])
  })
})

describe("requestState", () => {
  it("says whose move it is while open", () => {
    expect(requestState(request, "incoming", NOW)).toEqual({
      open: true,
      label: "Waiting on you",
      tone: "open",
    })
    expect(requestState(request, "outgoing", NOW).label).toBe("Waiting on them")
  })

  it("reads a pending request past its expiry as expired", () => {
    const stale = { ...request, expires_at: "2026-05-01T00:00:00Z" }
    expect(requestState(stale, "incoming", NOW)).toEqual({
      open: false,
      label: "Expired",
      tone: "quiet",
    })
  })

  it("labels each settled status", () => {
    expect(requestState({ ...request, status: "paid" }, "incoming").tone).toBe(
      "good"
    )
    expect(
      requestState({ ...request, status: "declined" }, "incoming").label
    ).toBe("Declined")
  })
})

describe("request copy", () => {
  it("names the other side of the request", () => {
    expect(requestCounterparty(request, "incoming").username).toBe("ada")
    expect(requestCounterparty(request, "outgoing").username).toBe("obi")
    expect(requestHeadline(request, "incoming")).toBe("@ada asked you")
    expect(requestHeadline(request, "outgoing")).toBe("You asked @obi")
  })

  it("quotes the note when there is one", () => {
    expect(requestLine({ ...request, note: "suya" }, "incoming")).toBe("“suya”")
    expect(requestLine(request, "incoming")).toBe("Asked you for money")
    expect(requestLine(request, "outgoing")).toBe("You asked")
  })

  it("words the confirmations and outcomes", () => {
    expect(declineTitle(request)).toBe("Decline @ada?")
    expect(cancelTitle(request)).toBe("Cancel your ₦2,500 request?")
    expect(mutedMessage(request)).toBe("Declined. @ada can't ask you again.")
    expect(cannotCoverMessage(250000, 100000)).toBe(
      "That needs ₦2,500 — you have ₦1,000."
    )
  })
})

describe("estimatedRequestExpiry", () => {
  it("counts the expiry from when the request was made", () => {
    const made = Date.UTC(2026, 8, 1)
    expect(estimatedRequestExpiry(ulid(made), 7)).toBe(made + 7 * 86_400_000)
  })

  it("knows nothing for an id that isn't one of ours", () => {
    expect(estimatedRequestExpiry("not-an-id", 7)).toBeNull()
  })
})
