"use client"

import { SettingsIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { useFlag } from "@/features/config/hooks/use-flag"
import { EarningsHome } from "@/features/earnings/components/earnings-home"
import { MonetisationHome } from "@/features/earnings/components/monetisation-home"
import { BackHeader } from "@/features/navigation/components/back-header"
import { signal } from "@/features/signals/utils/queue"
import { useBack } from "@/hooks/use-back"
import { TransactionsPanel } from "../components/history/transactions-panel"
import { WalletHome } from "../components/home/wallet-home"
import { MoneyTabBar, type MoneySection } from "../components/money-tab-bar"
import { RequestsPanel } from "../components/requests/requests-panel"
import { WalletGate } from "../components/shared/wallet-gate"
import { useWalletHome } from "../hooks/home/use-wallet-home"
import { useRequests } from "../hooks/requests/use-requests"
import { MONEY_SETTINGS_PATH, payPath } from "../routes"
import { isOpenRequest } from "../utils/requests"

const TITLES: Record<MoneySection, string> = {
  home: "Money",
  transactions: "Transactions",
  requests: "Requests",
  earnings: "Monetisation",
}

export function WalletScreen() {
  const back = useBack()
  const walletEnabled = useFlag("wallet")
  const earningsEnabled = useFlag("earnings")

  if (!walletEnabled) {
    return (
      <>
        <BackHeader title="Money" onBack={back} />
        {earningsEnabled ? <EarningsHome /> : null}
      </>
    )
  }

  return <MoneyScreen earningsEnabled={earningsEnabled} onBack={back} />
}

function MoneyScreen({
  earningsEnabled,
  onBack,
}: {
  earningsEnabled: boolean
  onBack: () => void
}) {
  const router = useRouter()
  const [section, setSection] = useState<MoneySection>("home")
  const incoming = useRequests("incoming")
  const openRequests = incoming.items.filter(isOpenRequest).length

  useEffect(() => {
    signal("wallet_open")
  }, [])

  const active = section === "earnings" && !earningsEnabled ? "home" : section
  const sendAgain = (username: string) =>
    router.push(payPath({ mode: "send", to: username }))

  return (
    <>
      <BackHeader
        title={TITLES[active]}
        onBack={onBack}
        right={
          <IconButton
            icon={SettingsIcon}
            label="Money settings"
            onClick={() => router.push(MONEY_SETTINGS_PATH)}
          />
        }
      />
      <WalletGate>
        <MoneyTabBar
          section={active}
          onChange={setSection}
          earningsEnabled={earningsEnabled}
          badges={{ requests: openRequests }}
        />
        <div className="pb-24 md:pb-8">
          {active === "home" ? (
            <Home
              onOpenTransactions={() => setSection("transactions")}
              onSendAgain={sendAgain}
            />
          ) : active === "transactions" ? (
            <TransactionsPanel onSendAgain={sendAgain} />
          ) : active === "requests" ? (
            <RequestsPanel />
          ) : (
            <MonetisationHome />
          )}
        </div>
      </WalletGate>
    </>
  )
}

function Home({
  onOpenTransactions,
  onSendAgain,
}: {
  onOpenTransactions: () => void
  onSendAgain: (username: string) => void
}) {
  const home = useWalletHome()
  return (
    <WalletHome
      home={home}
      onOpenTransactions={onOpenTransactions}
      onSendAgain={onSendAgain}
    />
  )
}
