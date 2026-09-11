"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import {
  booleanFilter,
  PAGE_SIZE,
} from "@/features/admin/shell/utils/list-params"
import { FROZEN_STATES, FUNDED_STATES } from "../utils/wallet"
import { useWalletAccounts, useWalletSummary } from "./use-wallet"

const FILTERS = {
  q: parseAsString.withDefault(""),
  frozen: parseAsStringLiteral(FROZEN_STATES),
  funded: parseAsStringLiteral(FUNDED_STATES),
}

export function useWalletsScreen() {
  const list = useListParams(FILTERS)
  const query = useWalletAccounts({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    frozen: booleanFilter(list.query.frozen, "frozen"),
    funded: booleanFilter(list.query.funded, "funded"),
  })

  return { list, query, summary: useWalletSummary() }
}
