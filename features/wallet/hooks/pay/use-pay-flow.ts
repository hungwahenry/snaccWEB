"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useBack } from "@/hooks/use-back"
import {
  currencySymbol,
  formatMoney,
  inputToMoney,
  money,
  moneyToInput,
} from "@/lib/money"
import { payPath, WALLET_LIMITS_PATH, WALLET_PATH } from "../../routes"
import type { PayPrefill, PayStep, WalletRecipient } from "../../types"
import { keypadCap, typeAmount } from "../../utils/amount"
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

export function usePayFlow(prefill: PayPrefill, currency: string) {
  const { mode } = prefill
  const router = useRouter()
  const back = useBack(WALLET_PATH)
  const overview = useWalletOverview()
  const limits = useLimits({ enabled: mode !== "request" })
  const wallet = overview.data?.rules
  const nothing = money(0, currency)
  const depositMin = wallet?.deposit_minimum ?? nothing

  const [amount, setAmount] = useState(prefill.amount ?? "")
  const [note, setNote] = useState("")
  const [step, setStep] = useState<PayStep>("amount")
  const [doneTo, setDoneTo] = useState<string | null>(null)

  const recipient = usePayRecipient(mode, prefill, step === "recipient")
  const submit = usePaySubmit(mode, prefill.conversationId)
  const value = inputToMoney(amount, currency)
  const topUp = useTopUp(value, () => setDoneTo("your wallet"))

  const { target, pinned } = recipient
  const toBank = sendsToBank(mode, recipient.bankMode, target)
  const rules: AmountRules = {
    mode,
    amount: value,
    min:
      (mode === "topup" ? wallet?.deposit_minimum : wallet?.send_minimum) ??
      nothing,
    max:
      (mode === "topup" ? wallet?.deposit_maximum : undefined) ??
      keypadCap(currency),
    fee: toBank ? (wallet?.bank_fee ?? nothing) : nothing,
    balance: overview.data?.balance ?? nothing,
    leftToday: leftToday(limits.data, limitRail(mode, toBank)),
  }
  const check = checkAmount(rules)
  const ready = check.ready && wallet !== undefined
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
                  amount: moneyToInput(found.amount),
                })
              )
          : () => router.push(WALLET_LIMITS_PATH),
    }
  }
  const fix = fixAction(amountFix(check, depositMin))

  const press = useCallback(
    (key: string) => setAmount((current) => typeAmount(current, key, currency)),
    [currency]
  )

  function next() {
    if (!ready || (pinned && !target)) return
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
    if (!target || !ready || submit.isPending) return
    submit.mutate(
      { target, amount: value, note },
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
      symbol: currencySymbol(currency),
      target: pinned && target ? { target, label: targetLabel(target) } : null,
      resolvingTarget: pinned && target === null,
      hint,
      // Passing through a too-small amount on the way to typing a bigger one is not an error.
      warning: check.problem !== null && check.problem !== "below_min",
      fix,
      action: PAY_TITLES[mode],
      ready: ready && (!pinned || target !== null),
      busy: topUp.starting,
      onKey: press,
      onNext: next,
    },
    recipient: {
      ...recipient.step,
      title: recipientTitle(mode, value),
      placeholder: recipientPlaceholder(mode),
      feeNote:
        recipient.bankMode && wallet ? bankFeeNote(wallet.bank_fee) : null,
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
          lines: reviewLines(mode, value, check),
          showNote: target.kind === "user",
          note,
          setNote,
          noteMax: noteMax(mode),
          notePlaceholder: notePlaceholder(mode),
          footnote: reviewNote(mode, target),
          problem: check.problem ? hint : null,
          fix,
          submitLabel: submitLabel(mode, value, check.total),
          ready,
          submitting: submit.isPending,
          onBack: backFromReview,
          onSubmit: send,
        }
      : null,
    transfer: topUp.transfer
      ? {
          transfer: topUp.transfer,
          amount: formatMoney(value),
          starting: topUp.starting,
          onRestart: topUp.start,
          checking: topUp.checking,
          nothingYet: topUp.nothingYet,
          onCheck: topUp.check,
        }
      : null,
    done: {
      target: mode === "topup" ? null : target,
      amount: formatMoney(value),
      requesting: mode === "request",
      line: doneLine(mode, doneTo ?? ""),
      againLabel: againLabel(mode),
      onDone: back,
      onAgain: () => router.replace(payPath({ mode })),
    },
  }
}

export type PayFlow = ReturnType<typeof usePayFlow>
