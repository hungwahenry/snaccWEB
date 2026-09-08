"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { FollowUser } from "@/features/follows/types"
import { searchUsers } from "@/features/search/api"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getErrorMessage } from "@/lib/api/errors"
import { resolveBankAccount } from "../../api"
import type { PayMode } from "../../routes"
import type { Bank, WalletRecipient } from "../../types"
import { useBanks } from "./use-banks"
import { useRecipients } from "./use-recipients"

export type SendTarget =
  | { kind: "user"; user: FollowUser }
  | {
      kind: "bank"
      bankName: string
      accountName: string
      accountLast4: string
      source:
        { recipientId: string } | { bankCode: string; accountNumber: string }
    }

const ACCOUNT_NUMBER = /^\d{10}$/

function targetFromRecipient(
  recipient: WalletRecipient | null
): SendTarget | null {
  if (!recipient) return null
  if (recipient.kind === "user") {
    return recipient.user ? { kind: "user", user: recipient.user } : null
  }
  if (!recipient.bank) return null
  return {
    kind: "bank",
    bankName: recipient.bank.bank_name,
    accountName: recipient.bank.account_name,
    accountLast4: recipient.bank.account_last4,
    source: { recipientId: recipient.id },
  }
}

export function usePayRecipient(
  mode: PayMode,
  prefill: { username?: string; recipientId?: string },
  searching: boolean
) {
  const recipients = useRecipients({ enabled: mode !== "topup" })
  const banks = useBanks()

  const [query, setQuery] = useState(prefill.username ?? "")
  const [picked, setPicked] = useState<FollowUser | null>(null)
  const [bank, setBank] = useState<Bank | null>(null)
  const [chosen, setChosen] = useState<WalletRecipient | null>(null)
  const [bankPickerOpen, setBankPickerOpen] = useState(false)

  const trimmedQuery = query.trim()
  const bankMode = mode === "send" && ACCOUNT_NUMBER.test(trimmedQuery)
  const debounced = useDebouncedValue(trimmedQuery.replace(/^@/, ""), 300)

  const searchActive = searching && !bankMode && !picked && debounced.length > 1
  const suggestions = useQuery({
    queryKey: ["wallet", "pay", "users", debounced],
    queryFn: () => searchUsers(debounced, 1),
    enabled: searchActive,
  })

  const resolved = useQuery({
    queryKey: ["wallet", "pay", "resolve", bank?.code, trimmedQuery],
    queryFn: () =>
      resolveBankAccount({ bankCode: bank!.code, accountNumber: trimmedQuery }),
    enabled: bankMode && bank !== null,
    retry: false,
  })

  const pinnedRecipient = prefill.recipientId
    ? (recipients.data?.find(
        (recipient) => recipient.id === prefill.recipientId
      ) ?? null)
    : null
  const askable = (recipient: WalletRecipient | null) =>
    recipient && (mode !== "request" || recipient.kind === "user")
      ? recipient
      : null
  const pinnedUser = useQuery({
    queryKey: ["wallet", "pay", "user", prefill.username],
    queryFn: () => searchUsers(prefill.username!, 1),
    enabled: Boolean(prefill.username) && !prefill.recipientId,
    select: (page) =>
      page.items.find(
        (user) =>
          user.username?.toLowerCase() === prefill.username?.toLowerCase()
      ) ?? null,
  })
  const usernameUnknown = pinnedUser.isSuccess && pinnedUser.data === null
  const pinnedUnaskable =
    pinnedRecipient !== null && askable(pinnedRecipient) === null
  const pinned =
    (Boolean(prefill.recipientId) && !pinnedUnaskable) ||
    (Boolean(prefill.username) && !usernameUnknown)
  const searchTarget: SendTarget | null = picked
    ? { kind: "user", user: picked }
    : bankMode && bank && resolved.data
      ? {
          kind: "bank",
          bankName: bank.name,
          accountName: resolved.data.account_name,
          accountLast4: trimmedQuery.slice(-4),
          source: { bankCode: bank.code, accountNumber: trimmedQuery },
        }
      : null
  const target =
    targetFromRecipient(askable(chosen) ?? askable(pinnedRecipient)) ??
    (pinnedUser.data
      ? { kind: "user" as const, user: pinnedUser.data }
      : null) ??
    searchTarget

  function pickUser(user: FollowUser) {
    setPicked(user)
    setQuery(`@${user.username ?? ""}`)
  }

  function choose(recipient: WalletRecipient): boolean {
    if (!askable(recipient)) return false
    setChosen(recipient)
    return true
  }

  return {
    query,
    setQuery: (next: string) => {
      setQuery(next)
      setPicked(null)
      setChosen(null)
      if (!ACCOUNT_NUMBER.test(next.trim())) setBank(null)
    },
    bankMode,
    suggestions: picked ? [] : (suggestions.data?.items ?? []),
    searching: searchActive && suggestions.isFetching,
    noMatches:
      searchActive &&
      !suggestions.isFetching &&
      suggestions.data?.items.length === 0,
    picked,
    pickUser,
    recipients:
      mode === "send"
        ? (recipients.data ?? [])
        : (recipients.data ?? []).filter(
            (recipient) => recipient.kind === "user"
          ),
    chosen,
    choose,
    clearChosen: () => setChosen(null),
    banks: banks.data ?? [],
    bank,
    bankPickerOpen,
    setBankPickerOpen,
    selectBank: (next: Bank) => {
      setBank(next)
      setBankPickerOpen(false)
    },
    accountName: resolved.data?.account_name ?? null,
    resolving: resolved.isFetching,
    resolveFailed: resolved.isError ? getErrorMessage(resolved.error) : null,
    target,
    pinned,
  }
}
