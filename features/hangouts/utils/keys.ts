import { followKeys } from "@/features/follows/utils/keys"
import type { HangoutScope } from "../types"

export const hangoutKeys = {
  agreement: () => ["hangouts", "agreement"] as const,
  lists: () => ["hangouts", "lists"] as const,
  list: (scope: HangoutScope) => [...hangoutKeys.lists(), scope] as const,
  members: (snaccId: string) =>
    [...followKeys.lists(), "hangout-members", snaccId] as const,
  requests: (snaccId: string) => ["hangouts", "requests", snaccId] as const,
}
