"use client"

import type { ReactNode } from "react"
import { useWalletGate } from "../hooks/pin/use-wallet-gate"
import { PinSetup } from "./pin-setup"

export function WalletGate({ children }: { children: ReactNode }) {
  const gate = useWalletGate()
  if (gate.settingPin) {
    return <PinSetup mode="setup" onDone={gate.onPinDone} />
  }
  return <>{children}</>
}
