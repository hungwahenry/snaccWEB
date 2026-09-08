"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { MoneySettingsPanel } from "../components/settings/money-settings-panel"
import { WALLET_PATH } from "../routes"

export function MoneySettingsScreen() {
  const back = useBack(WALLET_PATH)
  return (
    <>
      <BackHeader title="Money settings" onBack={back} />
      <MoneySettingsPanel />
    </>
  )
}
