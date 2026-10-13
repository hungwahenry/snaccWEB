import type { UserRefWithCampus } from "@/lib/api/types"
import type { Money } from "@/lib/money"

export type EarningParty = UserRefWithCampus

/** How the money moved. Only a `credit` was caused by somebody engaging. */
export type EarningMovement = "credit" | "claim" | "adjustment"

export interface AdminEarning {
  id: string
  movement: EarningMovement
  /** The engagement that paid, when one did. Null on a claim or an admin adjustment. */
  type: string | null
  amount: Money
  note: string | null
  snacc_id: string | null
  beneficiary: EarningParty
  /** Who caused it. Null on a claim or adjustment, and on a credit whose actor deleted their account. */
  actor: EarningParty | null
  /** The admin behind an adjustment. */
  admin: EarningParty | null
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
