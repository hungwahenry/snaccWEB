"use client"

import { parseAsString } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import {
  useNotificationTypeActions,
  useNotificationTypes,
} from "./use-notification-types"

const FILTERS = { q: parseAsString.withDefault("") }

export function useNotificationTypesScreen() {
  const list = useListParams(FILTERS)

  return {
    list,
    query: useNotificationTypes(list.query.q),
    actions: useNotificationTypeActions(),
  }
}
