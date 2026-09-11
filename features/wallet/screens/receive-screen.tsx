"use client"

import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { AccountCard } from "../components/receive/account-card"
import { AccountPending } from "../components/receive/account-pending"
import { AccountActivation } from "../containers/account-activation"
import { WalletGate } from "../containers/wallet-gate"
import { useReceiveScreen } from "../hooks/receive/use-receive-screen"
import { WALLET_PATH } from "../routes"

export function ReceiveScreen() {
  const back = useBack(WALLET_PATH)
  return (
    <>
      <BackHeader title="Account number" onBack={back} />
      <WalletGate>
        <Receive />
      </WalletGate>
    </>
  )
}

function Receive() {
  const screen = useReceiveScreen()

  if (screen.view === "loading") {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="text-muted-foreground" />
      </div>
    )
  }
  if (screen.view === "failed") {
    return (
      <div className="py-24">
        <LoadFailed title="Could not load this" onRetry={screen.retry} />
      </div>
    )
  }
  if (screen.view === "active" && screen.account) {
    return (
      <AccountCard
        account={screen.account}
        copied={screen.copied}
        onCopy={screen.onCopy}
        onShare={screen.onShare}
      />
    )
  }
  if (screen.view === "pending") {
    return (
      <AccountPending
        checking={screen.checking}
        onCheck={screen.onCheckAgain}
      />
    )
  }
  return <AccountActivation failureReason={screen.failureReason} />
}
