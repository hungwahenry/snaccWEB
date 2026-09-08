"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { LimitsPanel } from "../components/limits/limits-panel"
import { MONEY_SETTINGS_PATH } from "../routes"

export function LimitsScreen() {
  const back = useBack(MONEY_SETTINGS_PATH)
  return (
    <>
      <BackHeader title="Your limits" onBack={back} />
      <LimitsPanel />
    </>
  )
}
