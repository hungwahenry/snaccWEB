"use client"

import { getFollowSuggestions } from "../api"
import { useFollowableList } from "./use-followable-list"

export function useFollowSuggestions() {
  return useFollowableList(["follows", "suggestions"], getFollowSuggestions)
}
