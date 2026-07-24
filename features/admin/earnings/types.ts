export interface EarningParty {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: { id: string; name: string; acronym: string } | null
}

export interface AdminEarning {
  id: string
  type: "reaction" | "resnacc"
  amount: number
  snacc_id: string | null
  beneficiary: EarningParty
  actor: EarningParty
  created_at: string
}

export interface AdminFund {
  university_id: string
  university: { id: string; name: string; slug: string; acronym: string }
  cap: number
  distributed: number
  created_at: string
}

export interface ListEarningsParams {
  page?: number
  perPage?: number
  beneficiaryId?: string
  actorId?: string
  snaccId?: string
  type?: "reaction" | "resnacc"
}
