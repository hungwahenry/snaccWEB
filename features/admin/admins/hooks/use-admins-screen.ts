"use client"

import { useAdmins } from "./use-admins"

export function useAdminsScreen() {
  return { query: useAdmins() }
}
