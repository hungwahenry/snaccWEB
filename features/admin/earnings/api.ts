import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminEarning, AdminFund, ListEarningsParams } from "./types"

export function listEarnings(params: ListEarningsParams) {
  return api.get<Paginated<AdminEarning>>("/admin/earnings", params as QueryParams)
}

export function listFunds() {
  return api.get<AdminFund[]>("/admin/earnings/funds")
}

export function provisionFund(input: { universityId: string; cap: number }) {
  return api.post<AdminFund>("/admin/earnings/funds", input)
}

export function adjustFund(universityId: string, cap: number) {
  return api.patch<AdminFund>(`/admin/earnings/funds/${universityId}`, { cap })
}
