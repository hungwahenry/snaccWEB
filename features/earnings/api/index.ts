import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  CampusFund,
  EarningEvent,
  EarningsBalance,
  EarningsClaim,
  TopSnacc,
} from "../types"

export const getEarningsBalance = () =>
  api.get<EarningsBalance>("/earnings/wallet")

export const getCampusFund = () => api.get<CampusFund | null>("/earnings/fund")

export const getTopSnaccs = () => api.get<TopSnacc[]>("/earnings/top-snaccs")

export const listEarningEvents = (page: number) =>
  api.get<Paginated<EarningEvent>>("/earnings/events", { page })

export const claimEarnings = () => api.post<EarningsClaim>("/wallet/claim")
