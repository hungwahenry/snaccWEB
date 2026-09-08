import type { FollowUser } from "@/features/follows/types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { CampusFund, TopSnacc, Wallet } from "../types"

export const getEarningsWallet = () => api.get<Wallet>("/earnings/wallet")

export const getCampusFund = () => api.get<CampusFund | null>("/earnings/fund")

export const getTopSnaccs = () => api.get<TopSnacc[]>("/earnings/top-snaccs")

export interface EarningEvent {
  id: string
  type: "reaction" | "resnacc" | "bonus"
  amount: number
  actor: FollowUser
  snacc: { id: string; body: string | null } | null
  created_at: string
}

export const listEarningEvents = (page: number) =>
  api.get<Paginated<EarningEvent>>("/earnings/events", { page })
