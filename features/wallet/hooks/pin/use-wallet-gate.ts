"use client"

import { useState } from "react"
import { useWalletOverview } from "../account/use-wallet-overview"

export function useWalletGate() {
  const overview = useWalletOverview()

  // Set during render, not in an effect, so the setup shows on the same pass the wallet loads.
  const [needsPin, setNeedsPin] = useState(false)
  if (!needsPin && overview.data && !overview.data.pin_set) setNeedsPin(true)
  const [pinDone, setPinDone] = useState(false)

  return {
    settingPin: needsPin && !pinDone,
    onPinDone: () => setPinDone(true),
  }
}
