"use client"

import { useQuery } from "@tanstack/react-query"
import { listAdmins } from "../api"

export const ADMINS_KEY = ["admin", "admins"]

export function useAdmins() {
  return useQuery({ queryKey: ADMINS_KEY, queryFn: listAdmins })
}
