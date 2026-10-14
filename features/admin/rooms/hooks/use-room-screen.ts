"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useCountryChoices } from "@/features/admin/countries/hooks/use-country-choices"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import {
  booleanFilter,
  PAGE_SIZE,
} from "@/features/admin/shell/utils/list-params"
import { HELD_VALUES } from "../utils/rooms"
import { useRoom, useRoomActions, useRoomMessages } from "./use-rooms"

const FILTERS = {
  q: parseAsString.withDefault(""),
  held: parseAsStringLiteral(HELD_VALUES),
}

export function useRoomScreen(id: string) {
  const list = useListParams(FILTERS)
  const messages = useRoomMessages(id, {
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    held: booleanFilter(list.query.held, "true"),
  })

  return {
    room: useRoom(id),
    list,
    messages,
    actions: useRoomActions(),
    countryNames: useCountryChoices().names,
  }
}
