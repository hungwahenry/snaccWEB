"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { LimitsPanel } from "../components/limits/limits-panel"
import { useLimitsScreen } from "../hooks/account/use-limits-screen"
import { MONEY_SETTINGS_PATH } from "../routes"

export function LimitsScreen() {
  const back = useBack(MONEY_SETTINGS_PATH)
  const screen = useLimitsScreen()

  return (
    <>
      <BackHeader title="Your limits" onBack={back} />
      <LimitsPanel {...screen} />
    </>
  )
}
