"use client"

import { parseAsStringLiteral, useQueryState } from "nuqs"
import { WALLET_TABS } from "../utils/wallet"
import { useWallet, useWalletActions } from "./use-wallet"

const TAB = parseAsStringLiteral(WALLET_TABS).withDefault("entries")

export function useWalletDetailScreen(userId: string) {
  const [tab, setTab] = useQueryState(
    "tab",
    TAB.withOptions({ history: "replace" })
  )

  return {
    query: useWallet(userId),
    actions: useWalletActions(userId),
    tab,
    setTab,
  }
}
