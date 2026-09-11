"use client"

import { listFollowSuggestions } from "../api"
import { followKeys } from "../utils/keys"
import { usePeopleList } from "./use-people-list"

export function useFollowSuggestions() {
  return usePeopleList(followKeys.suggestions(), listFollowSuggestions)
}
