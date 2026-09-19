"use client"

import { useEffect } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { usePremium } from "@/features/premium/hooks/use-premium"
import {
  dropAccent,
  markSignedIn,
  wearAccentFor,
} from "../utils/accent-store"

export function useAccentEntitlement() {
  const userId = useMe().data?.id ?? null
  const standing = usePremium()
  const lapsed = standing.isSuccess && !standing.data.active

  useEffect(() => {
    if (!userId) return
    markSignedIn()
    wearAccentFor(userId)
  }, [userId])

  useEffect(() => {
    if (lapsed) dropAccent()
  }, [lapsed])
}
