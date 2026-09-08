"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { signal } from "@/features/signals/utils/queue"
import { useBack } from "@/hooks/use-back"
import { getErrorMessage } from "@/lib/api/errors"
import { formatNaira, koboToInput, nairaToKobo } from "@/lib/format"
import { createRequest, sendToBank, sendToUser } from "../../api"
import { payPath, WALLET_PATH, type PayMode } from "../../routes"
import type { WalletRecipient } from "../../types"
import { REQUESTS_KEY } from "../../utils/keys"
import { walletChanged } from "../account/use-wallet-cache"
import { useWalletOverview } from "../account/use-wallet-overview"
import { useMoneyConfirm } from "../pin/use-money-confirm"
import { usePayRecipient } from "./use-pay-recipient"
import { useTopUp } from "./use-top-up"

export type { PayMode }
export type { SendTarget } from "./use-pay-recipient"

const AMOUNT_CAP = 10_000_000_00

export function usePayFlow(
  mode: PayMode,
  prefill: {
    username?: string
    recipientId?: string
    conversationId?: string
    amount?: string
  } = {}
) {
  const router = useRouter()
  const back = useBack(WALLET_PATH)
  const queryClient = useQueryClient()
  const overview = useWalletOverview()
  const confirm = useMoneyConfirm()

  const [amount, setAmount] = useState(prefill.amount ?? "")
  const [note, setNote] = useState("")
  const [step, setStep] = useState<"amount" | "recipient" | "review">("amount")
  const [done, setDone] = useState<string | null>(null)

  const recipient = usePayRecipient(mode, prefill, step === "recipient")
  const { target, pinned, bankMode } = recipient
  const amountKobo = nairaToKobo(amount)
  const minKobo = useConfigValue("wallet.send.min_kobo")
  const bankFeeKobo = useConfigValue("wallet.send.bank_fee_kobo")
  const depositMin = useConfigValue("wallet.deposit.min_kobo")
  const balance = overview.data?.balance ?? 0

  const min = mode === "topup" ? depositMin : minKobo
  const toBank = mode === "send" && (bankMode || target?.kind === "bank")
  const fee = toBank ? bankFeeKobo : 0
  const needsBalance = mode === "send"
  const amountOk =
    amountKobo >= min &&
    amountKobo <= AMOUNT_CAP &&
    (!needsBalance || amountKobo + fee <= balance) &&
    (!pinned || target !== null)

  function press(key: string) {
    setAmount((current) => {
      if (key === "back") return current.slice(0, -1)
      if (key === ".") {
        if (current.includes(".")) return current
        return current === "" ? "0." : `${current}.`
      }
      const next = current === "0" ? key : current + key
      const [, decimals] = next.split(".")
      if (decimals && decimals.length > 2) return current
      if (nairaToKobo(next) > AMOUNT_CAP) return current
      return next
    })
  }

  const topUp = useTopUp(amountKobo, () => setDone("your wallet"))

  function toRecipient() {
    if (!amountOk) return
    if (mode === "topup") {
      topUp.start()
      return
    }
    setStep(pinned ? "review" : "recipient")
  }

  function pickRecipient(next: WalletRecipient) {
    if (!recipient.choose(next)) return
    setStep("review")
  }

  function toReview() {
    if (!target) return
    setStep("review")
  }

  function backFromReview() {
    if (recipient.chosen) {
      recipient.clearChosen()
      setStep("recipient")
      return
    }
    setStep(pinned ? "amount" : "recipient")
  }

  const sending = useMutation({
    mutationFn: async () => {
      if (!target) return null

      if (mode === "request") {
        const username = target.kind === "user" ? target.user.username : null
        if (!username) return null

        await createRequest({
          username,
          amountKobo,
          note: note.trim() || undefined,
          conversationId: prefill.conversationId,
        })
        signal("wallet_request", {
          detail: prefill.conversationId ? "dm" : "app",
        })
        void queryClient.invalidateQueries({ queryKey: REQUESTS_KEY })
        return `@${username}`
      }

      if (target.kind === "bank") {
        const sent = await confirm.run(
          { amountKobo, kind: "bank" },
          (credential) =>
            sendToBank({ amountKobo, ...target.source, ...credential })
        )
        return sent ? target.accountName : null
      }

      const username = target.user.username
      if (!username) return null

      const sent = await confirm.run(
        { amountKobo, kind: "user" },
        (credential) =>
          sendToUser({
            username,
            amountKobo,
            conversationId: prefill.conversationId,
            note: note.trim() || undefined,
            ...credential,
          })
      )
      return sent ? `@${username}` : null
    },
    onSuccess: (to) => {
      if (!to) return
      if (mode !== "request") walletChanged()
      signal("wallet_send", {
        detail:
          target?.kind === "bank"
            ? "bank"
            : prefill.conversationId
              ? "dm"
              : "user",
      })
      setDone(to)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return {
    mode,
    step,
    amount,
    amountKobo,
    amountLabel: formatNaira(amountKobo),
    amountOk,
    min,
    fee,
    balance,
    insufficient: needsBalance && amountKobo > 0 && amountKobo + fee > balance,
    shortfall: Math.max(0, amountKobo + fee - balance),
    addMoney: () =>
      router.push(
        payPath({
          mode: "topup",
          amount: koboToInput(Math.max(0, amountKobo + fee - balance)),
        })
      ),
    note,
    setNote,
    press,
    toRecipient,
    backToAmount: () => setStep("amount"),
    backFromReview,
    toReview,
    ...recipient,
    pickRecipient,
    total: amountKobo + fee,
    balanceAfter: needsBalance ? balance - amountKobo - fee : null,
    recipientReady:
      target !== null && (mode !== "request" || target.kind === "user"),
    submitting: sending.isPending,
    submit: () => sending.mutate(),
    transfer: topUp.transfer,
    topUp: topUp.start,
    starting: topUp.starting,
    checking: topUp.checking,
    checkTopUp: topUp.check,
    done,
    finish: back,
    again: () => router.replace(payPath({ mode })),
  }
}

export type PayFlow = ReturnType<typeof usePayFlow>
