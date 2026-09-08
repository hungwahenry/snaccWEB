"use client"

import { can } from "../utils/permissions"
import { useMe } from "./use-me"

export function useCan(key: string): boolean {
  const me = useMe()
  return can(me.data?.permissions, key)
}
