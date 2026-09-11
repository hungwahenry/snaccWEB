"use client"

import { useState } from "react"
import type { MoneyRequest } from "../../types"
import { useRequestActions } from "./use-request-actions"

export function useRequestSheet() {
  const actions = useRequestActions()
  const [request, setRequest] = useState<MoneyRequest | null>(null)
  const [open, setOpen] = useState(false)

  function fromSheet(act: (request: MoneyRequest) => void) {
    return () => {
      if (!request) return
      setOpen(false)
      act(request)
    }
  }

  return {
    actions,
    open: (next: MoneyRequest) => {
      setRequest(next)
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      request,
      busy: request !== null && actions.isBusy(request.id),
      onPay: fromSheet(actions.pay),
      onDecline: fromSheet(actions.decline),
      onCancel: fromSheet(actions.cancel),
    },
  }
}
