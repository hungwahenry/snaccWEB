import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminEarning,
  AdminFund,
  EarningListQuery,
  FundInput,
} from "../types"

export function listEarnings(query: EarningListQuery) {
  return api.get<Paginated<AdminEarning>>("/admin/earnings", query)
}

export function listFunds() {
  return api.get<AdminFund[]>("/admin/earnings/funds")
}

export function provisionFund(input: FundInput) {
  return api.post<AdminFund>("/admin/earnings/funds", input)
}

export function adjustFund(universityId: string, cap: number) {
  return api.patch<AdminFund>(`/admin/earnings/funds/${universityId}`, { cap })
}
