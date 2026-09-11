"use client"

import { useState } from "react"
import { useSearchUsers } from "@/features/search/hooks/use-search"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type {
  Payee,
  PayMode,
  PayPrefill,
  SendTarget,
  WalletRecipient,
} from "../../types"
import {
  bankTarget,
  canTarget,
  isAccountNumber,
  recipientsFor,
  targetFromRecipient,
  userNamed,
} from "../../utils/recipients"
import { useBankAccountName } from "./use-bank-account-name"
import { useBankChoice } from "./use-bank-choice"
import { useRecipients } from "./use-recipients"

const SUGGESTIONS = 5
const RECENTS = 6

export function usePayRecipient(
  mode: PayMode,
  prefill: PayPrefill,
  searching: boolean
) {
  const recipients = useRecipients({ enabled: mode !== "topup" })
  const bankChoice = useBankChoice()

  const [query, setQuery] = useState(prefill.to ?? "")
  const [picked, setPicked] = useState<Payee | null>(null)
  const [chosen, setChosen] = useState<WalletRecipient | null>(null)

  const trimmed = query.trim()
  const bankMode = mode === "send" && isAccountNumber(trimmed)
  const resolved = useBankAccountName(bankChoice.bank, trimmed, bankMode)

  const debounced = useDebouncedValue(trimmed.replace(/^@/, ""), 300)
  const searchActive = searching && !bankMode && !picked && debounced.length > 1
  const search = useSearchUsers(debounced, searchActive)

  const linkedUsername = prefill.recipientId ? undefined : prefill.to
  const linkedSearch = useSearchUsers(
    linkedUsername ?? "",
    Boolean(linkedUsername)
  )
  const linkedUser = linkedUsername
    ? userNamed(linkedSearch.users, linkedUsername)
    : null
  const linkedSettled = !linkedSearch.loading && !linkedSearch.stale
  const linkedUnknown =
    Boolean(linkedUsername) && linkedSettled && linkedUser === null

  const savedRecipient = prefill.recipientId
    ? (recipients.data?.find(
        (recipient) => recipient.id === prefill.recipientId
      ) ?? null)
    : null
  const savedGone =
    Boolean(prefill.recipientId) &&
    recipients.isSuccess &&
    savedRecipient === null
  const savedUsable = savedRecipient === null || canTarget(mode, savedRecipient)

  const pinned =
    (Boolean(prefill.recipientId) && !savedGone && savedUsable) ||
    (Boolean(linkedUsername) && !linkedUnknown)

  const searchTarget: SendTarget | null = picked
    ? { kind: "user", user: picked }
    : bankMode && bankChoice.bank && resolved.name
      ? bankTarget(bankChoice.bank, trimmed, resolved.name)
      : null

  const target =
    targetFromRecipient(canTarget(mode, chosen) ? chosen : null) ??
    targetFromRecipient(savedUsable ? savedRecipient : null) ??
    (linkedUser ? { kind: "user" as const, user: linkedUser } : null) ??
    searchTarget

  function changeQuery(next: string) {
    setQuery(next)
    setPicked(null)
    setChosen(null)
    if (!isAccountNumber(next)) bankChoice.clear()
  }

  function pickUser(user: Payee) {
    setPicked(user)
    setQuery(`@${user.username ?? ""}`)
  }

  function choose(recipient: WalletRecipient): boolean {
    if (!canTarget(mode, recipient)) return false
    setChosen(recipient)
    return true
  }

  return {
    target,
    pinned,
    bankMode,
    chosen: chosen !== null,
    clearChosen: () => setChosen(null),
    choose,
    step: {
      query,
      setQuery: changeQuery,
      bankMode,
      bankName: bankChoice.bank?.name ?? null,
      openBankPicker: bankChoice.open,
      bankPicker: bankChoice.picker,
      resolved,
      suggestions:
        picked || !searchActive ? [] : search.users.slice(0, SUGGESTIONS),
      searching: searchActive && search.loading,
      noMatches:
        searchActive &&
        !search.loading &&
        !search.stale &&
        search.users.length === 0,
      onPickUser: pickUser,
      recents:
        !bankMode && !picked && trimmed.length === 0
          ? recipientsFor(mode, recipients.data ?? []).slice(0, RECENTS)
          : [],
    },
  }
}
