import type {
  WalletAccountListQuery,
  WalletTransactionListQuery,
} from "../types"

export const adminWalletKeys = {
  all: () => ["admin", "wallet"] as const,
  summary: () => ["admin", "wallet", "summary"] as const,
  accounts: (query: WalletAccountListQuery) =>
    ["admin", "wallet", "accounts", query] as const,
  transactions: (query: WalletTransactionListQuery) =>
    ["admin", "wallet", "transactions", query] as const,
  detail: (userId: string) => ["admin", "wallet", "detail", userId] as const,
}
