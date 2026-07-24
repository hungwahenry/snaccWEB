export type WithdrawalStatus = "pending" | "success" | "failed" | "reversed"

export interface WithdrawalUser {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: { id: string; name: string; acronym: string } | null
}

export interface WithdrawalEvent {
  status: string
  payload: unknown
  created_at: string
}

export interface AdminWithdrawal {
  id: string
  reference: string
  amount: number
  status: WithdrawalStatus
  bank_name: string
  account_last4: string
  account_name: string
  balance_before: number
  balance_after: number
  transfer_code: string | null
  failure_reason: string | null
  completed_at: string | null
  created_at: string
  user: WithdrawalUser
  events: WithdrawalEvent[]
}

export interface ListWithdrawalsParams {
  page?: number
  perPage?: number
  status?: WithdrawalStatus
}

export interface SettleWithdrawalInput {
  status: "success" | "failed" | "reversed"
  reason?: string
}
