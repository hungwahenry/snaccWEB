"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { legalPath } from "../routes"

export function useLegalLinks() {
  const country = useMe().data?.profile?.country_code ?? null

  return {
    terms: legalPath("terms", country),
    privacy: legalPath("privacy", country),
  }
}
