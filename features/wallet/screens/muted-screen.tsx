"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { MutedPanel } from "../components/settings/muted-panel"
import { useMutedScreen } from "../hooks/requests/use-muted-screen"
import { MONEY_SETTINGS_PATH } from "../routes"

export function MutedScreen() {
  const back = useBack(MONEY_SETTINGS_PATH)
  const screen = useMutedScreen()

  return (
    <>
      <BackHeader title="Muted requesters" onBack={back} />
      <MutedPanel {...screen} />
    </>
  )
}
