"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { WITHDRAWAL_STATUSES } from "../utils/status"
import { useWithdrawalSummary, useWithdrawals } from "./use-withdrawals"

const FILTERS = {
  q: parseAsString.withDefault(""),
  status: parseAsStringLiteral(WITHDRAWAL_STATUSES),
}

export function useWithdrawalsScreen() {
  const list = useListParams(FILTERS)
  const query = useWithdrawals({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    status: list.query.status ?? undefined,
  })

  return { list, query, summary: useWithdrawalSummary() }
}
