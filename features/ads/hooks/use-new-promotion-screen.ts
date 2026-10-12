"use client"

import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { useSnacc } from "@/features/snaccs/hooks/use-snacc"
import { useBack } from "@/hooks/use-back"
import { isNotFound } from "@/lib/api/errors"
import { PROMOTIONS_PATH } from "../routes"
import { isPromotable } from "../utils/promotable"

export function useNewPromotionScreen(snaccId: string | null) {
  const onBack = useBack(PROMOTIONS_PATH)
  const enabled = useFlagWhenKnown("ads_manager")
  const query = useSnacc(enabled ? snaccId : null)
  const snacc = query.data ?? null

  return {
    onBack,
    enabled,
    loading: enabled === null || (snaccId !== null && query.isPending),
    failed: query.isError && !isNotFound(query.error),
    retry: () => void query.refetch(),
    snacc: snacc && isPromotable(snacc) ? snacc : null,
  }
}
