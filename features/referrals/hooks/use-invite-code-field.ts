"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { nameOf } from "@/features/users/utils/names"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { lookupInviteCode } from "../api"
import {
  inviteCodeStatus,
  isCompleteInviteCode,
  normalizeInviteCode,
} from "../utils/invite"
import { referralKeys } from "../utils/keys"

export function useInviteCodeField() {
  const [value, setValue] = useState("")
  const settled = useDebouncedValue(value, 400)

  const lookup = useQuery({
    queryKey: referralKeys.lookup(settled),
    queryFn: () => lookupInviteCode(settled),
    enabled: isCompleteInviteCode(settled),
    retry: false,
  })

  const status = inviteCodeStatus({
    typed: value,
    settled,
    checking: lookup.isFetching,
    found: lookup.isSuccess,
    missing: lookup.isError,
  })
  const inviter = status === "valid" ? (lookup.data ?? null) : null

  return {
    value,
    change: (raw: string) => setValue(normalizeInviteCode(raw)),
    status,
    message:
      status === "valid" && inviter
        ? `${nameOf(inviter)}’s invite`
        : status === "invalid"
          ? "That code doesn’t exist."
          : null,
  }
}

export type InviteCodeField = ReturnType<typeof useInviteCodeField>
