"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useCountryChoices } from "@/features/admin/countries/hooks/use-country-choices"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import {
  booleanFilter,
  PAGE_SIZE,
} from "@/features/admin/shell/utils/list-params"
import { LOCK_VALUES, ROOM_KINDS } from "../utils/rooms"
import { useRooms } from "./use-rooms"

const FILTERS = {
  q: parseAsString.withDefault(""),
  kind: parseAsStringLiteral(ROOM_KINDS),
  locked: parseAsStringLiteral(LOCK_VALUES),
}

export function useRoomsScreen() {
  const list = useListParams(FILTERS)
  const query = useRooms({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    kind: list.query.kind ?? undefined,
    locked: booleanFilter(list.query.locked, "true"),
  })

  return { list, query, countryNames: useCountryChoices().names }
}
