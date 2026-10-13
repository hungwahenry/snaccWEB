import type { UserRefWithCampus } from "@/lib/api/types"
import type { Money } from "@/lib/money"

export type WithdrawalStatus = "pending" | "success" | "failed" | "reversed"

export interface WithdrawalEvent {
  status: WithdrawalStatus
  payload: unknown
  created_at: string
}

export interface AdminWithdrawal {
  id: string
  reference: string
  amount: Money
  status: WithdrawalStatus
  bank_name: string
  account_last4: string
  account_name: string
  /** Only on the detail and after a retry. */
  account_number?: string | null
  recipient_code: string
  balance_before: Money
  balance_after: Money
  transfer_code: string | null
  failure_reason: string | null
  completed_at: string | null
  created_at: string
  user: UserRefWithCampus
  events: WithdrawalEvent[]
}

export type WithdrawalListQuery = {
  page: number
  perPage: number
  status?: WithdrawalStatus
  q?: string
}

export interface WithdrawalSummary {
  pending: { count: number; totals: Money[]; oldest_at: string | null }
  paid: { days: number; count: number; totals: Money[] }
}
