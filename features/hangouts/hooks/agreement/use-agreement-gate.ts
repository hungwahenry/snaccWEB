"use client"

import { useMutation } from "@tanstack/react-query"
import { useCallback, useRef, useState } from "react"
import { getQueryClient } from "@/lib/query/client"
import { agreeToHangouts, getHangoutAgreement } from "../../api"
import { hangoutKeys } from "../../utils/keys"

export type EnsureAgreed = () => Promise<boolean>

export function useAgreementGate() {
  const [open, setOpen] = useState(false)
  const resolver = useRef<((agreed: boolean) => void) | null>(null)

  const settle = useCallback((agreed: boolean) => {
    const pending = resolver.current
    resolver.current = null
    setOpen(false)
    pending?.(agreed)
  }, [])

  const agree = useMutation({
    mutationFn: agreeToHangouts,
    onSuccess: () => {
      getQueryClient().setQueryData(hangoutKeys.agreement(), true)
      settle(true)
    },
  })

  const ensure = useCallback<EnsureAgreed>(async () => {
    const agreed = await getQueryClient().fetchQuery({
      queryKey: hangoutKeys.agreement(),
      queryFn: getHangoutAgreement,
      staleTime: Infinity,
    })
    if (agreed) return true

    return new Promise<boolean>((resolve) => {
      resolver.current?.(false)
      resolver.current = resolve
      setOpen(true)
    })
  }, [])

  return {
    ensure,
    dialog: {
      open,
      pending: agree.isPending,
      onAgree: () => agree.mutate(),
      onDismiss: () => settle(false),
    },
  }
}
