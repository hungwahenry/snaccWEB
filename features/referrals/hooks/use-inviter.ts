"use client"

import { useQuery } from "@tanstack/react-query"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { lookupInviteCode } from "../api"
import { isCompleteInviteCode } from "../utils/invite"
import { referralKeys } from "../utils/keys"

export function useInviter(code: string) {
  const settled = useDebouncedValue(code, 400)

  return useQuery({
    queryKey: referralKeys.inviter(settled),
    queryFn: () => lookupInviteCode(settled),
    enabled: isCompleteInviteCode(settled),
    retry: false,
  })
}
