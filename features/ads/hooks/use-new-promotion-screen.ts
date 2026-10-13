"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { useSnacc } from "@/features/snaccs/hooks/use-snacc"
import { useBack } from "@/hooks/use-back"
import { isNotFound } from "@/lib/api/errors"
import { PROMOTIONS_PATH } from "../routes"
import { isPromotable } from "../utils/promotable"
import { useCampaign } from "./use-campaigns"

export function useNewPromotionScreen(
  snaccId: string | null,
  fromId: string | null
) {
  const onBack = useBack(PROMOTIONS_PATH)
  const enabled = useFlagWhenKnown("ads_manager")
  const query = useSnacc(enabled ? snaccId : null)
  const source = useCampaign(fromId ?? "", enabled === true && fromId !== null)
  const snacc = query.data ?? null
  const me = useMe()

  return {
    onBack,
    enabled,
    loading:
      enabled === null ||
      me.isPending ||
      (snaccId !== null && query.isPending) ||
      (fromId !== null && source.isPending),
    failed: query.isError && !isNotFound(query.error),
    retry: () => void query.refetch(),
    snacc: snacc && isPromotable(snacc) ? snacc : null,
    source: source.data ?? null,
    currency: me.data?.currency ?? null,
  }
}
