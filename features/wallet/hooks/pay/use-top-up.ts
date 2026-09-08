"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { signal } from "@/features/signals/utils/queue"
import { getErrorMessage } from "@/lib/api/errors"
import { startDeposit, verifyDeposit } from "../../api"
import type { DepositAccount } from "../../types"
import { walletChanged } from "../account/use-wallet-cache"

export function useTopUp(amountKobo: number, onLanded: () => void) {
  const [transfer, setTransfer] = useState<DepositAccount | null>(null)
  const [checking, setChecking] = useState(false)
  const landed = useRef(false)
  const land = useRef(onLanded)

  useEffect(() => {
    land.current = onLanded
  }, [onLanded])

  const starting = useMutation({
    mutationFn: () => startDeposit(amountKobo),
    onSuccess: (account) => {
      setTransfer(account)
      signal("wallet_topup", { detail: "started" })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const settling = useQuery({
    queryKey: ["wallet", "deposit", transfer?.reference],
    queryFn: () => verifyDeposit(transfer!.reference),
    enabled: transfer !== null,
    refetchInterval: (query) =>
      query.state.data?.status === "success" ? false : 10_000,
  })

  const settled = settling.data?.status === "success" ? settling.data : null
  useEffect(() => {
    if (!settled || landed.current) return
    landed.current = true
    walletChanged(settled)
    signal("wallet_topup", { detail: "landed" })
    land.current()
  }, [settled])

  async function check() {
    if (checking) return
    setChecking(true)
    const result = await settling.refetch()
    setChecking(false)
    if (result.error) toast.error(getErrorMessage(result.error))
    else if (result.data?.status !== "success")
      toast("Nothing yet — the moment your bank sends it, it lands.")
  }

  return {
    transfer,
    start: () => {
      if (!starting.isPending) starting.mutate()
    },
    starting: starting.isPending,
    checking,
    check: () => void check(),
  }
}
