import { describe, expect, it } from "vitest"
import { previewAdjustment } from "@/features/admin/shell/utils/money"
import type { WalletRecipient } from "../types"
import {
  adjustHint,
  DEPOSIT_STATUS,
  FROZEN_OPTIONS,
  FUNDED_OPTIONS,
  holdersNote,
  personalAccountLine,
  poolNote,
  recipientAccount,
  recipientKey,
  toAdjustInput,
  WALLET_TAB_LABELS,
  WALLET_TABS,
  walletState,
} from "./wallet"

const recipient = (patch: Partial<WalletRecipient> = {}): WalletRecipient => ({
  kind: "bank",
  bank_name: "GTBank",
  account_last4: "1234",
  account_name: "Bola A",
  last_used_at: "2026-09-01T00:00:00Z",
  ...patch,
})

describe("filters", () => {
  it("offers frozen or active, and holding money", () => {
    expect(FROZEN_OPTIONS.map((option) => option.label)).toEqual([
      "Frozen",
      "Active",
    ])
    expect(FUNDED_OPTIONS).toEqual([
      { value: "funded", label: "Holding money" },
    ])
  })
})

describe("tabs", () => {
  it("names every tab", () => {
    expect(WALLET_TABS.map((tab) => WALLET_TAB_LABELS[tab])).toEqual([
      "Movements",
      "Deposits",
      "Recipients",
    ])
  })
})

describe("poolNote", () => {
  it("says what each known pool holds", () => {
    expect(poolNote("earnings")).toBe("Owed as unclaimed earnings")
    expect(poolNote("payouts")).toBe("On its way to banks")
    expect(poolNote("deposits")).toBe("Paid in from banks")
    expect(poolNote("fees")).toBe("Kept as fees")
    expect(poolNote("adjustments")).toBe("Moved by hand")
  })

  it("falls back for a pool it doesn't know", () => {
    expect(poolNote("mystery")).toBe("System pool")
  })
})

describe("holdersNote", () => {
  it("counts wallets and how many are frozen", () => {
    expect(holdersNote({ accounts: 1200, balance: 0, frozen: 3 })).toBe(
      "1,200 wallets · 3 frozen"
    )
    expect(holdersNote({ accounts: 1, balance: 0, frozen: 0 })).toBe(
      "1 wallet · 0 frozen"
    )
  })
})

describe("walletState", () => {
  it("says whether the wallet is frozen", () => {
    expect(walletState(null)).toEqual({ label: "Active", variant: "secondary" })
    expect(walletState("2026-09-01T00:00:00Z")).toEqual({
      label: "Frozen",
      variant: "destructive",
    })
  })
})

describe("DEPOSIT_STATUS", () => {
  it("names every deposit status", () => {
    expect(DEPOSIT_STATUS.pending.label).toBe("Pending")
    expect(DEPOSIT_STATUS.success.label).toBe("Success")
    expect(DEPOSIT_STATUS.abandoned.label).toBe("Abandoned")
  })
})

describe("personalAccountLine", () => {
  it("is empty without a personal account", () => {
    expect(personalAccountLine(null)).toBeUndefined()
  })

  it("shows the number, the bank and where it stands", () => {
    expect(
      personalAccountLine({
        status: "active",
        account_number: "0123456789",
        bank_name: "Wema Bank",
        failure_reason: null,
      })
    ).toBe("Personal account 0123456789 · Wema Bank (active)")
    expect(
      personalAccountLine({
        status: "pending",
        account_number: null,
        bank_name: null,
        failure_reason: null,
      })
    ).toBe("Personal account — · — (pending)")
  })
})

describe("recipientAccount", () => {
  it("shows the name and the last four digits", () => {
    expect(recipientAccount(recipient())).toBe("Bola A ····1234")
    expect(
      recipientAccount(recipient({ account_name: null, account_last4: null }))
    ).toBe("—")
  })
})

describe("recipientKey", () => {
  it("tells two recipients apart", () => {
    expect(recipientKey(recipient())).not.toBe(
      recipientKey(recipient({ account_last4: "9999" }))
    )
  })
})

describe("adjustHint", () => {
  it("shows where the balance lands", () => {
    expect(adjustHint(100_000, previewAdjustment(100_000, "-250"))).toBe(
      "Their balance goes from ₦1,000 to ₦750."
    )
  })

  it("explains an amount that can't be posted, and stays quiet when empty", () => {
    expect(adjustHint(0, previewAdjustment(0, "-5"))).toBe(
      "That would take them below zero."
    )
    expect(adjustHint(0, previewAdjustment(0, ""))).toBeNull()
  })
})

describe("toAdjustInput", () => {
  it("needs a usable amount and a reason", () => {
    expect(toAdjustInput(previewAdjustment(0, "500"), "  Refund  ")).toEqual({
      delta: 50_000,
      reason: "Refund",
    })
    expect(toAdjustInput(previewAdjustment(0, "500"), "   ")).toBeNull()
    expect(toAdjustInput(previewAdjustment(0, "abc"), "Refund")).toBeNull()
  })
})
