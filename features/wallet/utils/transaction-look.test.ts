import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
} from "lucide-react"
import { describe, expect, it } from "vitest"
import type { WalletTransaction, WalletTransactionDetail } from "../types"
import {
  deliveryLine,
  sendAgainLabel,
  signedAmount,
  transactionLook,
  transactionRows,
  transactionStatus,
  transactionSubtitle,
} from "./transaction-look"

const transaction: WalletTransaction = {
  id: "t1",
  type: "transfer",
  label: "To @ada",
  amount: 150000,
  direction: "out",
  balance_after: 50000,
  note: null,
  created_at: "2026-03-04T09:05:00",
}

const detail: WalletTransactionDetail = {
  ...transaction,
  reference: "ref_1",
  fee: 0,
  total: 150000,
  status: "success",
  channel: null,
  counterparty: null,
  context: null,
  delivery: null,
}

describe("transactionLook", () => {
  it("points a transfer the way the money went", () => {
    expect(transactionLook(transaction).icon).toBe(ArrowUpRightIcon)
    expect(transactionLook({ ...transaction, direction: "in" }).icon).toBe(
      ArrowDownLeftIcon
    )
  })

  it("greens only money in", () => {
    expect(transactionLook({ ...transaction, direction: "in" }).amount).toBe(
      "text-success"
    )
    expect(transactionLook(transaction).amount).toBe("text-foreground")
  })

  it("has a look for a Premium purchase", () => {
    expect(transactionLook({ type: "premium", direction: "out" }).icon).toBe(
      BadgeCheckIcon
    )
  })
})

describe("transaction copy", () => {
  it("signs amounts", () => {
    expect(signedAmount("in", 150000)).toBe("+₦1,500")
    expect(signedAmount("out", 150000)).toBe("−₦1,500")
  })

  it("puts the note before the time", () => {
    expect(transactionSubtitle({ ...transaction, note: "suya" })).toMatch(
      /^suya · 9:05/
    )
    expect(transactionSubtitle(transaction)).toMatch(/^9:05/)
  })

  it("labels payout statuses, keeping unknown ones readable", () => {
    expect(transactionStatus("pending")).toEqual({
      label: "On its way",
      tone: "quiet",
    })
    expect(transactionStatus("weird").label).toBe("weird")
  })

  it("offers to send back what came in", () => {
    expect(sendAgainLabel("out")).toBe("Send again")
    expect(sendAgainLabel("in")).toBe("Send back")
  })

  it("describes where a bank send went", () => {
    expect(
      deliveryLine({
        status: "success",
        bank_name: "GTBank",
        account_last4: "6789",
        account_name: "Ada Obi",
        timeline: [],
      })
    ).toBe("Ada Obi · GTBank ••6789")
  })
})

describe("transactionRows", () => {
  it("always ends with the balance after and the reference", () => {
    expect(transactionRows(detail)).toEqual([
      { label: "Balance after", value: "₦500" },
      { label: "Reference", value: "ref_1", mono: true },
    ])
  })

  it("adds the fee, total, channel and context when they apply", () => {
    const rows = transactionRows({
      ...detail,
      fee: 2500,
      total: 152500,
      channel: "bank_transfer",
      context: { kind: "request", note: null },
    })
    expect(rows.map((row) => row.label)).toEqual([
      "For",
      "Via",
      "Fee",
      "Total",
      "Balance after",
      "Reference",
    ])
    expect(rows[0].value).toBe("A request")
    expect(rows[1].value).toBe("Bank transfer")
  })
})
