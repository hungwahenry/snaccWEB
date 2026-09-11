"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { signal } from "@/features/signals/utils/queue"
import { MONEY_SETTINGS_PATH } from "../../routes"
import type { MoneySection } from "../../types"
import {
  moneyTabs,
  sectionTitle,
  visibleSection,
} from "../../utils/money-sections"
import { openRequests } from "../../utils/requests"
import { useRequests } from "../requests/use-requests"

export function useMoneyScreen() {
  const router = useRouter()
  const earningsEnabled = useFlag("earnings")
  const [section, setSection] = useState<MoneySection>("home")
  const incoming = useRequests("incoming")

  useEffect(() => {
    signal("wallet_open")
  }, [])

  const active = visibleSection(section, earningsEnabled)

  return {
    section: active,
    title: sectionTitle(active),
    onSettings: () => router.push(MONEY_SETTINGS_PATH),
    onSeeAllTransactions: () => setSection("transactions"),
    tabBar: {
      tabs: moneyTabs(earningsEnabled),
      section: active,
      badges: { requests: openRequests(incoming.items).length },
      onChange: setSection,
    },
  }
}
