"use client"

import { usePeopleList } from "@/features/follows/hooks/use-people-list"
import { followKeys } from "@/features/follows/utils/keys"
import { listProfileViews } from "../api"

export function useProfileVisitors(enabled: boolean) {
  return usePeopleList(followKeys.visitors(), listProfileViews, { enabled })
}
