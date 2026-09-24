import type { UserRef } from "@/lib/api/types"

export type ReferralStatus = "pending" | "qualified" | "held" | "paid" | "void"

export interface ReferralPerson extends UserRef {
  joined_at: string
  suspended: boolean
}

export interface AdminReferral {
  id: string
  referrer: ReferralPerson
  referee: ReferralPerson
  status: ReferralStatus
  reason: string | null
  platform: string | null
  install_id: string | null
  ip: string | null
  qualified_at: string | null
  paid_at: string | null
  reviewed_at: string | null
  created_at: string
}

export type ReferralListQuery = {
  page: number
  perPage: number
  status?: ReferralStatus
}
