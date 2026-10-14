import type { UserRefWithCampus } from "@/lib/api/types"
import type { Money } from "@/lib/money"

export type EarningParty = UserRefWithCampus

export interface AdminEarning {
  id: string
  type: string | null
  amount: Money
  snacc_id: string | null
  beneficiary: EarningParty
  actor: EarningParty | null
  created_at: string
}

export interface AdminFund {
  university_id: string
  university: { id: string; name: string; slug: string; acronym: string }
  cap: Money
  distributed: Money
  created_at: string
}

export type EarningListQuery = {
  page: number
  perPage: number
  type?: string
}

export interface FundInput {
  universityId: string
  cap: Money
}

export interface FundDraft {
  universityId: string
  cap: string
}
