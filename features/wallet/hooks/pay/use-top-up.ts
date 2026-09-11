"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { signal } from "@/features/signals/utils/queue"
import { showError } from "@/lib/feedback"
import { startDeposit, verifyDeposit } from "../../api"
import { walletChanged } from "../../cache"
import type { DepositAccount } from "../../types"
import { walletKeys } from "../../utils/keys"

const CHECK_EVERY_MS = 10_000

/**
 * A top-up by bank transfer: get an account number to send to, then watch for the money. It is
 * checked every few seconds, at once when a balance push arrives, and whenever they tap to check.
 */
export function useTopUp(amountKobo: number, onLanded: () => void) {
  const [transfer, setTransfer] = useState<DepositAccount | null>(null)
  const [landed, setLanded] = useState(false)
  const [checking, setChecking] = useState(false)
  const [nothingYet, setNothingYet] = useState(false)
  const landing = useRef(false)

  const starting = useMutation({
    mutationFn: () => startDeposit(amountKobo),
    onSuccess: (account) => {
      setTransfer(account)
      setNothingYet(false)
      signal("wallet_topup", { detail: "started" })
    },
  })

  const reference = transfer?.reference ?? ""
  const settling = useQuery({
    queryKey: walletKeys.deposit(reference),
    queryFn: async () => {
      const result = await verifyDeposit(reference)
      if (result.status === "success" && !landing.current) {
        landing.current = true
        setLanded(true)
        walletChanged(result)
        signal("wallet_topup", { detail: "landed" })
        onLanded()
      }
      return result
    },
    enabled: transfer !== null && !landed,
    refetchInterval: CHECK_EVERY_MS,
  })

  async function check() {
    if (checking) return
    setChecking(true)
    const result = await settling.refetch()
    setChecking(false)
    if (result.error) showError(result.error)
    else setNothingYet(result.data?.status !== "success")
  }

  return {
    transfer,
    start: () => {
      if (!starting.isPending) starting.mutate()
    },
    starting: starting.isPending,
    checking,
    nothingYet,
    check: () => void check(),
  }
}
