"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { MutedPanel } from "../components/settings/muted-panel"
import { MONEY_SETTINGS_PATH } from "../routes"

export function MutedScreen() {
  const back = useBack(MONEY_SETTINGS_PATH)
  return (
    <>
      <BackHeader title="Muted requesters" onBack={back} />
      <MutedPanel />
    </>
  )
}
