"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import {
  booleanFilter,
  PAGE_SIZE,
} from "@/features/admin/shell/utils/list-params"
import { SNACC_STATES } from "../utils/snaccs"
import { useSnaccActions, useSnaccs } from "./use-snaccs"

const FILTERS = {
  q: parseAsString.withDefault(""),
  state: parseAsStringLiteral(SNACC_STATES),
}

export function useSnaccsScreen() {
  const list = useListParams(FILTERS)
  const query = useSnaccs({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    deleted: booleanFilter(list.query.state, "deleted"),
  })

  return { list, query, actions: useSnaccActions() }
}
