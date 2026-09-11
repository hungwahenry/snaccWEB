"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useBack } from "@/hooks/use-back"
import { formatNaira, koboToInput, nairaToKobo } from "@/lib/format"
import { payPath, WALLET_LIMITS_PATH, WALLET_PATH } from "../../routes"
import type { PayPrefill, PayStep, WalletRecipient } from "../../types"
import { AMOUNT_CAP_KOBO, typeAmount } from "../../utils/amount"
import {
  amountFix,
  amountHint,
  checkAmount,
  leftToday,
  limitRail,
  sendsToBank,
  type AmountFix,
  type AmountRules,
} from "../../utils/pay"
import {
  againLabel,
  bankFeeNote,
  doneLine,
  noteMax,
  notePlaceholder,
  PAY_TITLES,
  recipientPlaceholder,
  recipientTitle,
  reviewLines,
  reviewNote,
  submitLabel,
} from "../../utils/pay-copy"
import { targetLabel } from "../../utils/recipients"
import { useLimits } from "../account/use-limits"
import { useWalletOverview } from "../account/use-wallet-overview"
import { usePayRecipient } from "./use-pay-recipient"
import { usePaySubmit } from "./use-pay-submit"
import { useTopUp } from "./use-top-up"

export function usePayFlow(prefill: PayPrefill) {
  const { mode } = prefill
  const router = useRouter()
  const back = useBack(WALLET_PATH)
  const overview = useWalletOverview()
  const limits = useLimits({ enabled: mode !== "request" })
  const minSend = useConfigValue("wallet.send.min_kobo")
  const bankFee = useConfigValue("wallet.send.bank_fee_kobo")
  const depositMin = useConfigValue("wallet.deposit.min_kobo")
  const depositMax = useConfigValue("wallet.deposit.max_kobo")

  const [amount, setAmount] = useState(prefill.amount ?? "")
  const [note, setNote] = useState("")
  const [step, setStep] = useState<PayStep>("amount")
  const [doneTo, setDoneTo] = useState<string | null>(null)

  const recipient = usePayRecipient(mode, prefill, step === "recipient")
  const submit = usePaySubmit(mode, prefill.conversationId)
  const amountKobo = nairaToKobo(amount)
  const topUp = useTopUp(amountKobo, () => setDoneTo("your wallet"))

  const { target, pinned } = recipient
  const toBank = sendsToBank(mode, recipient.bankMode, target)
  const rules: AmountRules = {
    mode,
    amountKobo,
    minKobo: mode === "topup" ? depositMin : minSend,
    maxKobo: mode === "topup" ? depositMax : AMOUNT_CAP_KOBO,
    feeKobo: toBank ? bankFee : 0,
    balance: overview.data?.balance ?? 0,
    leftToday: leftToday(limits.data, limitRail(mode, toBank)),
  }
  const check = checkAmount(rules)
  const hint = amountHint(rules, check)
  const recipientReady =
    target !== null && (mode !== "request" || target.kind === "user")

  function fixAction(found: AmountFix | null) {
    if (!found) return null
    return {
      label: found.label,
      onPress:
        found.kind === "topup"
          ? () =>
              router.push(
                payPath({
                  mode: "topup",
                  amount: koboToInput(found.amountKobo),
                })
              )
          : () => router.push(WALLET_LIMITS_PATH),
    }
  }
  const fix = fixAction(amountFix(check, depositMin))

  const press = useCallback(
    (key: string) => setAmount((current) => typeAmount(current, key)),
    []
  )

  function next() {
    if (!check.ready || (pinned && !target)) return
    if (mode === "topup") topUp.start()
    else setStep(pinned ? "review" : "recipient")
  }

  function toReview() {
    if (recipientReady) setStep("review")
  }

  function pickRecent(choice: WalletRecipient) {
    if (recipient.choose(choice)) setStep("review")
  }

  function backFromReview() {
    if (recipient.chosen) {
      recipient.clearChosen()
      setStep("recipient")
      return
    }
    setStep(pinned ? "amount" : "recipient")
  }

  function send() {
    if (!target || !check.ready || submit.isPending) return
    submit.mutate(
      { target, amountKobo, note },
      {
        onSuccess: (to) => {
          if (to) setDoneTo(to)
        },
      }
    )
  }

  const screen: PayStep | "transfer" | "done" = doneTo
    ? "done"
    : topUp.transfer
      ? "transfer"
      : step

  return {
    screen,
    title: PAY_TITLES[mode],
    onBack: back,
    amount: {
      raw: amount,
      target: pinned && target ? { target, label: targetLabel(target) } : null,
      hint,
      // Passing through a too-small amount on the way to typing a bigger one is not an error.
      warning: check.problem !== null && check.problem !== "below_min",
      fix,
      action: PAY_TITLES[mode],
      ready: check.ready && (!pinned || target !== null),
      busy: topUp.starting,
      onKey: press,
      onNext: next,
    },
    recipient: {
      ...recipient.step,
      title: recipientTitle(mode, amountKobo),
      placeholder: recipientPlaceholder(mode),
      feeNote: recipient.bankMode ? bankFeeNote(bankFee) : null,
      ready: recipientReady,
      onPickRecent: pickRecent,
      onBack: () => setStep("amount"),
      onNext: toReview,
    },
    review: target
      ? {
          target,
          label: targetLabel(target),
          requesting: mode === "request",
          lines: reviewLines(mode, amountKobo, check),
          showNote: target.kind === "user",
          note,
          setNote,
          noteMax: noteMax(mode),
          notePlaceholder: notePlaceholder(mode),
          footnote: reviewNote(mode, target),
          problem: check.problem ? hint : null,
          fix,
          submitLabel: submitLabel(mode, amountKobo, check.total),
          ready: check.ready,
          submitting: submit.isPending,
          onBack: backFromReview,
          onSubmit: send,
        }
      : null,
    transfer: topUp.transfer
      ? {
          transfer: topUp.transfer,
          amount: formatNaira(amountKobo),
          starting: topUp.starting,
          onRestart: topUp.start,
          checking: topUp.checking,
          nothingYet: topUp.nothingYet,
          onCheck: topUp.check,
        }
      : null,
    done: {
      target: mode === "topup" ? null : target,
      amount: formatNaira(amountKobo),
      requesting: mode === "request",
      line: doneLine(mode, doneTo ?? ""),
      againLabel: againLabel(mode),
      onDone: back,
      onAgain: () => router.replace(payPath({ mode })),
    },
  }
}

export type PayFlow = ReturnType<typeof usePayFlow>
