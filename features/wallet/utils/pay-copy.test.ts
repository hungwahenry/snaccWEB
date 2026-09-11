import { describe, expect, it } from "vitest"
import type { SendTarget } from "../types"
import {
  againLabel,
  bankFeeNote,
  doneLine,
  noteMax,
  notePlaceholder,
  recipientPlaceholder,
  recipientTitle,
  reviewAmountLabel,
  reviewLines,
  reviewNote,
  submitLabel,
} from "./pay-copy"

const user: SendTarget = {
  kind: "user",
  user: { id: "u1", username: "ada", display_name: "Ada", avatar_url: "" },
}
const bank: SendTarget = {
  kind: "bank",
  bankName: "GTBank",
  accountName: "Ada Obi",
  accountLast4: "6789",
  source: { recipientId: "r1" },
}

describe("pay copy", () => {
  it("titles the recipient step with the amount", () => {
    expect(recipientTitle("send", 500000)).toBe("Send ₦5,000")
    expect(recipientTitle("request", 100)).toBe("Request ₦1")
  })

  it("only offers account numbers on a send", () => {
    expect(recipientPlaceholder("send")).toContain("account number")
    expect(recipientPlaceholder("request")).toBe("@username on Snacc")
  })

  it("words the review for asking or sending", () => {
    expect(reviewAmountLabel("request")).toBe("You are asking for")
    expect(reviewAmountLabel("send")).toBe("You are sending")
    expect(notePlaceholder("request")).toBe("What is it for? (optional)")
    expect(noteMax("request")).toBe(280)
    expect(noteMax("send")).toBe(140)
  })

  it("notes the bank fee only when there is one", () => {
    expect(bankFeeNote(2500)).toBe("Bank sends carry a ₦25 fee.")
    expect(bankFeeNote(0)).toBeNull()
  })

  it("lists the fee, total and balance after only when they apply", () => {
    expect(
      reviewLines("send", 100000, {
        fee: 2500,
        total: 102500,
        balanceAfter: 47500,
      })
    ).toEqual([
      { label: "You are sending", value: "₦1,000", hero: true },
      { label: "Bank fee", value: "₦25" },
      { label: "Total", value: "₦1,025" },
      { label: "Balance after", value: "₦475" },
    ])
    expect(
      reviewLines("request", 100000, {
        fee: 0,
        total: 100000,
        balanceAfter: null,
      })
    ).toEqual([{ label: "You are asking for", value: "₦1,000", hero: true }])
  })

  it("warns about what cannot be undone", () => {
    expect(reviewNote("send", bank)).toContain("Bank sends cannot be reversed")
    expect(reviewNote("send", user)).toContain("land instantly")
    expect(reviewNote("request", user)).toContain("Nothing moves")
  })

  it("puts the total, fee included, on the send button", () => {
    expect(submitLabel("send", 100000, 102500)).toBe("Send ₦1,025")
    expect(submitLabel("request", 100000, 100000)).toBe("Request ₦1,000")
  })

  it("says where it went", () => {
    expect(doneLine("send", "@ada")).toBe("Sent to @ada.")
    expect(doneLine("request", "@ada")).toContain("Asked @ada")
    expect(doneLine("topup", "your wallet")).toBe("Added to your wallet.")
  })

  it("offers another go except after a top-up", () => {
    expect(againLabel("send")).toBe("Send another")
    expect(againLabel("request")).toBe("Ask someone else")
    expect(againLabel("topup")).toBeNull()
  })
})
