import type { HistoryFilter, RequestBox } from "../types"

/**
 * One transaction sits under `transaction`, never under the `transactions` a list starts with, so
 * refreshing every list can't feed a page updater to a receipt.
 */
export const walletKeys = {
  overview: () => ["wallet", "overview"] as const,
  limits: () => ["wallet", "limits"] as const,
  summaries: () => ["wallet", "summary"] as const,
  summary: (month: string) => ["wallet", "summary", month] as const,
  transactionLists: () => ["wallet", "transactions"] as const,
  transactions: (filter: HistoryFilter) =>
    ["wallet", "transactions", filter] as const,
  transactionDetails: () => ["wallet", "transaction"] as const,
  transaction: (id: string) => ["wallet", "transaction", id] as const,
  recipients: () => ["wallet", "recipients"] as const,
  banks: () => ["wallet", "banks"] as const,
  bankAccount: (bankCode: string, accountNumber: string) =>
    ["wallet", "bank-account", bankCode, accountNumber] as const,
  requestLists: () => ["wallet", "requests"] as const,
  requests: (box: RequestBox) => ["wallet", "requests", box] as const,
  mutes: () => ["wallet", "mutes"] as const,
  virtualAccount: () => ["wallet", "virtual-account"] as const,
  deposits: () => ["wallet", "deposit"] as const,
  deposit: (reference: string) => ["wallet", "deposit", reference] as const,
}

/** Mutations whose runs a list reads back, so each row shows its own pending state. */
export const walletMutationKeys = {
  payRequest: () => ["wallet", "pay-request"] as const,
  declineRequest: () => ["wallet", "decline-request"] as const,
  cancelRequest: () => ["wallet", "cancel-request"] as const,
  unmute: () => ["wallet", "unmute"] as const,
  removeRecipient: () => ["wallet", "remove-recipient"] as const,
}
