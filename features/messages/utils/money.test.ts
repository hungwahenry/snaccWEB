import { ulid } from "ulid"
import { describe, expect, it } from "vitest"
import type { MessageMoney } from "../types"
import { moneyCard } from "./money"

const DAY = 86_400_000
const made = Date.UTC(2026, 8, 1)

const request = (status: string) =>
  ({
    kind: "request",
    amount: 250_000,
    transaction_id: null,
    request: { id: ulid(made), status },
  }) as MessageMoney

describe("moneyCard", () => {
  it("offers Pay on an open request sent to you", () => {
    const card = moneyCard(request("pending"), false, 7, made + DAY)
    expect(card).toMatchObject({ payable: true, status: "Waiting" })
  })

  it("never offers Pay on your own request", () => {
    expect(moneyCard(request("pending"), true, 7, made + DAY).payable).toBe(
      false
    )
  })

  it("reads a pending request past its expiry as expired, with no Pay", () => {
    const card = moneyCard(request("pending"), false, 7, made + 8 * DAY)
    expect(card).toMatchObject({ payable: false, status: "Expired" })
  })

  it("shows what happened to a settled request", () => {
    expect(moneyCard(request("paid"), false, 7, made + DAY)).toMatchObject({
      payable: false,
      status: "Paid",
    })
  })

  it("opens the receipt behind a transfer", () => {
    const sent = {
      kind: "sent",
      amount: 100,
      transaction_id: "t1",
      request: null,
    } as MessageMoney
    expect(moneyCard(sent, false, 7)).toMatchObject({
      openable: true,
      received: true,
      status: null,
    })
  })
})
