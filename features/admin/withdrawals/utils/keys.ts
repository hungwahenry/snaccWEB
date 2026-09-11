import type { WithdrawalListQuery } from "../types"

export const adminWithdrawalKeys = {
  all: () => ["admin", "withdrawals"] as const,
  list: (query: WithdrawalListQuery) =>
    ["admin", "withdrawals", "list", query] as const,
  summary: () => ["admin", "withdrawals", "summary"] as const,
  detail: (id: string) => ["admin", "withdrawals", "detail", id] as const,
}
