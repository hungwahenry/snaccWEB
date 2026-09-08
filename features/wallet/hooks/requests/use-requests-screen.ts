"use client"

import { useState } from "react"
import type { MoneyRequest } from "../../types"
import type { RequestBox } from "../../utils/requests"
import { useRequestActions } from "./use-request-actions"
import { useRequests } from "./use-requests"

export function useRequestsScreen() {
  const [box, setBox] = useState<RequestBox>("incoming")
  const list = useRequests(box)
  const actions = useRequestActions()
  const [detail, setDetail] = useState<MoneyRequest | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  function fromSheet(act: (request: MoneyRequest) => void) {
    return (request: MoneyRequest) => {
      setDetailOpen(false)
      act(request)
    }
  }

  return {
    box,
    setBox,
    list,
    busyId: actions.busyId,
    pay: actions.pay,
    decline: actions.decline,
    cancel: actions.cancel,
    detail,
    detailOpen,
    setDetailOpen,
    open: (request: MoneyRequest) => {
      setDetail(request)
      setDetailOpen(true)
    },
    fromSheet,
  }
}
