"use client"

import { useQuery } from "@tanstack/react-query"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { getReferralOverview, listInvitees } from "../api"
import { referralKeys } from "../utils/keys"

export function useReferralOverview(enabled = true) {
  return useQuery({
    queryKey: referralKeys.overview(),
    queryFn: getReferralOverview,
    enabled,
  })
}

export function useInvitees() {
  return useInfiniteList(referralKeys.invitees(), listInvitees)
}
