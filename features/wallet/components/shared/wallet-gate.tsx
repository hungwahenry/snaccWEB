"use client"

import { useState, type ReactNode } from "react"
import { useWalletOverview } from "../../hooks/account/use-wallet-overview"
import { PinSetupPanel } from "../pin/pin-setup-panel"

/// Nothing in the wallet renders until a PIN exists: the first visit sets one up in place.
export function WalletGate({ children }: { children: ReactNode }) {
  const overview = useWalletOverview()
  const [finished, setFinished] = useState(false)
  const [setupOpen, setSetupOpen] = useState(false)

  if (!setupOpen && overview.data && !overview.data.pin_set) setSetupOpen(true)

  if (setupOpen && !finished) {
    return <PinSetupPanel mode="setup" onDone={() => setFinished(true)} />
  }

  return <>{children}</>
}
