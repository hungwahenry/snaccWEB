"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { PinSetupPanel } from "../components/pin/pin-setup-panel"
import { MONEY_SETTINGS_PATH } from "../routes"

export function PinScreen() {
  const back = useBack(MONEY_SETTINGS_PATH)
  return (
    <>
      <BackHeader title="Wallet PIN" onBack={back} />
      <PinSetupPanel mode="change" onDone={back} />
    </>
  )
}
