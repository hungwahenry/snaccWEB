"use client"

import { useEngagementActions, useEngagementGroups } from "./use-engagement"

export function useEngagementScreen() {
  return { query: useEngagementGroups(), actions: useEngagementActions() }
}
