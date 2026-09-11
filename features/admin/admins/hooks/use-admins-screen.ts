"use client"

import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import { useAdmins } from "./use-admins"

export function useAdminsScreen() {
  return { query: useAdmins(), campuses: useCampuses() }
}
