"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import {
  booleanFilter,
  PAGE_SIZE,
} from "@/features/admin/shell/utils/list-params"
import { DELETED_VALUES, HELD_VALUES } from "../utils/moments"
import { useMomentActions, useMoments } from "./use-moments"

const FILTERS = {
  q: parseAsString.withDefault(""),
  held: parseAsStringLiteral(HELD_VALUES),
  deleted: parseAsStringLiteral(DELETED_VALUES),
}

export function useMomentsScreen() {
  const list = useListParams(FILTERS)
  const query = useMoments({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    held: booleanFilter(list.query.held, "true"),
    deleted: booleanFilter(list.query.deleted, "true"),
  })

  return { list, query, actions: useMomentActions() }
}
