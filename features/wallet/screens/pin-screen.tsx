"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { PinSetup } from "../containers/pin-setup"
import { MONEY_SETTINGS_PATH } from "../routes"

export function PinScreen() {
  const back = useBack(MONEY_SETTINGS_PATH)
  return (
    <>
      <BackHeader title="Wallet PIN" onBack={back} />
      <PinSetup mode="change" onDone={back} />
    </>
  )
}
