"use client"

import { SettingsIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { useFlag } from "@/features/config/hooks/use-flag"
import { MyEarnings } from "@/features/earnings/containers/my-earnings"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { TransactionsPanel } from "../components/history/transactions-panel"
import { WalletHome } from "../components/home/wallet-home"
import { MoneyTabBar } from "../components/money-tab-bar"
import { RequestsPanel } from "../components/requests/requests-panel"
import { WalletGate } from "../containers/wallet-gate"
import { useTransactionsScreen } from "../hooks/history/use-transactions-screen"
import { useMoneyScreen } from "../hooks/home/use-money-screen"
import { useWalletHome } from "../hooks/home/use-wallet-home"
import { useRequestsScreen } from "../hooks/requests/use-requests-screen"

export function WalletScreen() {
  const back = useBack()
  const walletEnabled = useFlag("wallet")
  const earningsEnabled = useFlag("earnings")

  if (!walletEnabled) {
    return (
      <>
        <BackHeader title="Money" onBack={back} />
        {earningsEnabled ? <MyEarnings /> : null}
      </>
    )
  }

  return <MoneyScreen onBack={back} />
}

function MoneyScreen({ onBack }: { onBack: () => void }) {
  const screen = useMoneyScreen()

  return (
    <>
      <BackHeader
        title={screen.title}
        onBack={onBack}
        right={
          <IconButton
            icon={SettingsIcon}
            label="Money settings"
            onClick={screen.onSettings}
          />
        }
      />
      <WalletGate>
        <MoneyTabBar {...screen.tabBar} />
        <div className="pb-[calc(var(--money-bar-height)+16px)] md:pb-8">
          {screen.section === "home" ? (
            <HomeSection onSeeAll={screen.onSeeAllTransactions} />
          ) : screen.section === "transactions" ? (
            <TransactionsSection />
          ) : screen.section === "requests" ? (
            <RequestsSection />
          ) : (
            <MyEarnings />
          )}
        </div>
      </WalletGate>
    </>
  )
}

function HomeSection({ onSeeAll }: { onSeeAll: () => void }) {
  const home = useWalletHome()
  return <WalletHome {...home} onSeeAll={onSeeAll} />
}

function TransactionsSection() {
  const screen = useTransactionsScreen()
  return <TransactionsPanel {...screen} />
}

function RequestsSection() {
  const screen = useRequestsScreen()
  return <RequestsPanel {...screen} />
}
