"use client"

import { parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { REFERRAL_STATUSES } from "../utils/status"
import { useReferralActions, useReferrals } from "./use-referrals"

const FILTERS = {
  status: parseAsStringLiteral(REFERRAL_STATUSES),
}

export function useReferralsScreen() {
  const list = useListParams(FILTERS)
  const query = useReferrals({
    page: list.query.page,
    perPage: PAGE_SIZE,
    status: list.query.status ?? undefined,
  })

  return { list, query, actions: useReferralActions() }
}
