"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { TRANSACTION_TYPES } from "../utils/wallet"
import { useWalletTransactions } from "./use-wallet"

const FILTERS = {
  q: parseAsString.withDefault(""),
  type: parseAsStringLiteral(TRANSACTION_TYPES),
}

export function useLedgerScreen() {
  const list = useListParams(FILTERS)
  const query = useWalletTransactions({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    type: list.query.type ?? undefined,
  })

  return { list, query }
}
