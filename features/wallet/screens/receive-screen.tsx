"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { ReceivePanel } from "../components/receive/receive-panel"
import { WalletGate } from "../components/shared/wallet-gate"
import { WALLET_PATH } from "../routes"

export function ReceiveScreen() {
  const back = useBack(WALLET_PATH)
  return (
    <>
      <BackHeader title="Account number" onBack={back} />
      <WalletGate>
        <ReceivePanel />
      </WalletGate>
    </>
  )
}
