import type { UserRefWithCampus } from "@/lib/api/types"
import type { SuspensionDraft } from "@/features/admin/suspension-reasons/types"
import type { WithdrawalStatus } from "@/features/admin/withdrawals/types"
import type { Money } from "@/lib/money"

export type AccountRole = "user" | "admin"

export interface AdminUserRow extends UserRefWithCampus {
  email: string
  role: AccountRole
  email_verified_at: string | null
  suspended_at: string | null
  suspended_until: string | null
  suspended_note: string | null
  suspended_reason: { id: string; slug: string; label: string } | null
  posts_globally: boolean
  is_private: boolean
  earnings_paused_at: string | null
  earnings_paused_reason: string | null
  payouts_blocked_at: string | null
  payouts_blocked_reason: string | null
  created_at: string
  balance: Money | null
  snaccs_count: number
  followers_count: number
  following_count: number
  total_views_received: number
  completed_at: string | null
}

export interface UserBooster {
  username: string | null
  email: string
  events: number
  earned: Money
}

export interface UserEngager {
  username: string | null
  email: string
  resnaccs: number
  replies: number
  total: number
  share: number
}

export interface LinkedAccount {
  id: string
  username: string | null
  email: string
  suspended: boolean
  shared_device: boolean
  shared_ip: boolean
}

export interface UserSession {
  id: string
  name: string
  ip: string | null
  client_info: string | null
  user_agent: string | null
  install_id: string | null
  last_used_at: string | null
  expires_at: string | null
  created_at: string
}

export interface BankRecipient {
  bank_name: string | null
  account_last4: string | null
  account_name: string | null
  recipient_code: string | null
  last_used_at: string
}

export interface AdminUserDetail extends AdminUserRow {
  birth_date: { day: number; month: number; year: number | null } | null
  legal_country: string | null
  engagement: {
    score: number
    tier: string | null
    received: Record<string, number>
  }
  earnings: {
    by_type: { type: string; events: number; earned: Money }[]
    top_boosters: UserBooster[]
  }
  top_engagers: UserEngager[]
  linked_accounts: LinkedAccount[]
  counts: {
    snaccs: number
    likes: number
    reports_filed: number
    reports_against: number
    withdrawals: number
    earnings_received: number
    device_tokens: number
  }
  bank_recipients: BankRecipient[]
  sessions: UserSession[]
  device_tokens: {
    platform: string
    disabled_at: string | null
    last_used_at: string | null
  }[]
  notification_preferences: {
    category: string
    push_enabled: boolean
    email_enabled: boolean
  }[]
  recent_withdrawals: {
    id: string
    amount: Money
    status: WithdrawalStatus
    reference: string
    created_at: string
    completed_at: string | null
  }[]
  reports_against: {
    id: string
    reason: { slug: string; label: string }
    detail: string | null
    snacc_id: string | null
    created_at: string
  }[]
}

export type UserListQuery = {
  page: number
  perPage: number
  q?: string
  role?: AccountRole
  suspended?: boolean
  universityId?: string
}

export interface AdjustEarningsInput {
  delta: Money
  reason?: string
}

/** Everything an admin can do to one account. Each resolves once the page shows the result. */
export interface BirthDateInput {
  birthDay: number
  birthMonth: number
  birthYear: number
}

export interface UserActions {
  suspend: (draft: SuspensionDraft, note?: string) => Promise<unknown>
  unsuspend: () => Promise<unknown>
  pause: (reason?: string) => Promise<unknown>
  resume: () => Promise<unknown>
  block: (reason?: string) => Promise<unknown>
  unblock: () => Promise<unknown>
  postEverywhere: () => Promise<unknown>
  bindToCampus: () => Promise<unknown>
  moveCampus: (universityId: string) => Promise<unknown>
  correctBirthDate: (input: BirthDateInput) => Promise<unknown>
  adjust: (input: AdjustEarningsInput) => Promise<unknown>
  signOut: () => Promise<unknown>
  remove: (confirmEmail: string) => Promise<unknown>
}
