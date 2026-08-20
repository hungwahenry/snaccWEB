export interface UniversityBadge {
  id: string
  name: string
  acronym: string
}

export interface AdminUserRow {
  id: string
  email: string
  role: string
  email_verified_at: string | null
  suspended_at: string | null
  suspended_reason: string | null
  earnings_paused_at: string | null
  earnings_paused_reason: string | null
  payouts_blocked_at: string | null
  payouts_blocked_reason: string | null
  created_at: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: UniversityBadge | null
  balance: number
  snaccs_count: number
  followers_count: number
  following_count: number
  total_views_received: number
  completed_at: string | null
}

export interface AdminUserDetail extends AdminUserRow {
  badges: {
    id: string
    key: string
    label: string
    icon: string
    color: string
    note: string | null
    granted_at: string
  }[]
  engagement: {
    score: number
    weekly_score: number
    campus_rank: number | null
    global_rank: number
    reactions_received: number
    resnaccs_received: number
    comments_received: number
  }
  earnings: {
    balance: number
    by_type: { type: string; events: number; kobo: number }[]
    top_boosters: { username: string | null; email: string; events: number; kobo: number }[]
  }
  top_engagers: {
    username: string | null
    email: string
    resnaccs: number
    replies: number
    total: number
    share: number
  }[]
  linked_accounts: {
    id: string
    username: string | null
    email: string
    suspended: boolean
    shared_device: boolean
    shared_ip: boolean
  }[]
  counts: {
    snaccs: number
    reactions: number
    reports_filed: number
    reports_against: number
    withdrawals: number
    earnings_received: number
    device_tokens: number
  }
  payout_account: {
    bank_name: string
    account_last4: string
    account_name: string
    recipient_code: string
    created_at: string
  } | null
  sessions: {
    id: string
    name: string
    ip: string | null
    client_info: string | null
    user_agent: string | null
    install_id: string | null
    last_used_at: string | null
    expires_at: string | null
    created_at: string
  }[]
  device_tokens: { platform: string; disabled_at: string | null; last_used_at: string | null }[]
  notification_preferences: { category: string; push_enabled: boolean; email_enabled: boolean }[]
  recent_withdrawals: {
    id: string
    amount: number
    status: string
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

export interface ListUsersParams {
  page?: number
  perPage?: number
  q?: string
  role?: string
  suspended?: boolean
  verified?: boolean
  completed?: boolean
  universityId?: string
}
