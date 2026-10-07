"use client"

import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useMyScore } from "@/features/score/hooks/use-my-score"
import type { UserScore } from "@/features/score/types"
import { MINUTE_MS } from "@/lib/duration"

export function usePremiumPreview() {
  const profile = useMe().data?.profile
  const tier = useMyScore().data?.tier ?? null
  const [postedAt] = useState(() =>
    new Date(Date.now() - MINUTE_MS).toISOString()
  )

  const score: UserScore = { tier: tier?.key ?? null, og: false }

  return {
    avatarUrl: profile?.avatar_url,
    username: profile?.username ?? null,
    displayName: profile?.display_name ?? null,
    university: profile?.university ?? null,
    score,
    postedAt,
  }
}
