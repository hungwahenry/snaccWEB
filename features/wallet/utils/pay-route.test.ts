import { describe, expect, it } from "vitest"
import { payPrefillFrom, prefillKey } from "./pay-route"

describe("payPrefillFrom", () => {
  it("defaults to a plain send", () => {
    expect(payPrefillFrom({})).toEqual({
      mode: "send",
      to: undefined,
      recipientId: undefined,
      conversationId: undefined,
      amount: undefined,
    })
  })

  it("reads every parameter a pay link carries", () => {
    expect(
      payPrefillFrom({
        mode: "request",
        to: "@ada",
        recipient: "r1",
        conversation: "c1",
        amount: "1500.50",
      })
    ).toEqual({
      mode: "request",
      to: "ada",
      recipientId: "r1",
      conversationId: "c1",
      amount: "1500.50",
    })
  })

  it("takes the first of a doubled parameter", () => {
    expect(payPrefillFrom({ mode: ["topup", "send"] }).mode).toBe("topup")
  })

  it("drops an unknown mode and an amount that is not money", () => {
    expect(payPrefillFrom({ mode: "steal", amount: "12abc" })).toMatchObject({
      mode: "send",
      amount: undefined,
    })
  })
})

describe("prefillKey", () => {
  it("changes whenever the link does", () => {
    const a = prefillKey(payPrefillFrom({ to: "ada" }))
    const b = prefillKey(payPrefillFrom({ to: "obi" }))
    expect(a).not.toBe(b)
    expect(prefillKey(payPrefillFrom({ to: "ada" }))).toBe(a)
  })
})
