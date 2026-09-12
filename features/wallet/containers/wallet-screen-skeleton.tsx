"use client"

import { SettingsIcon } from "lucide-react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { EarningsSkeleton } from "@/features/earnings/components/earnings-skeleton"
import { HeaderLink } from "@/features/navigation/components/header-link"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { WalletHomeSkeleton } from "../components/home/wallet-home-skeleton"
import { MoneyTabBar } from "../components/money-tab-bar"
import { MONEY_SETTINGS_PATH } from "../routes"
import { moneyTabs, sectionTitle } from "../utils/money-sections"

const NO_BADGES = {}
const ignore = () => {}

export function WalletScreenSkeleton() {
  const walletEnabled = useFlag("wallet")
  const earningsEnabled = useFlag("earnings")
  const accountNumberEnabled = useFlag("wallet_dva")
  const title = sectionTitle("home")

  if (!walletEnabled) {
    return (
      <>
        <RouteBackHeader title={title} />
        {earningsEnabled ? <EarningsSkeleton /> : null}
      </>
    )
  }

  return (
    <>
      <RouteBackHeader
        title={title}
        right={
          <HeaderLink
            href={MONEY_SETTINGS_PATH}
            icon={SettingsIcon}
            label="Money settings"
          />
        }
      />
      <MoneyTabBar
        tabs={moneyTabs(earningsEnabled)}
        section="home"
        badges={NO_BADGES}
        onChange={ignore}
      />
      <div className="pb-[calc(var(--money-bar-height)+16px)] md:pb-8">
        <WalletHomeSkeleton
          accountNumber={accountNumberEnabled}
          earnings={earningsEnabled}
        />
      </div>
    </>
  )
}
