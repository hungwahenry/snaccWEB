"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { WALLETS_PATH } from "@/features/admin/shell/routes"
import { WalletDetail } from "../components/wallet-detail"
import { useWalletDetailScreen } from "../hooks/use-wallet-detail-screen"

export function WalletDetailScreen({ userId }: { userId: string }) {
  const screen = useWalletDetailScreen(userId)

  return (
    <>
      <BackLink href={WALLETS_PATH} label="Back to wallets" />
      <QueryView query={screen.query} what="this wallet">
        {(wallet) => (
          <WalletDetail
            wallet={wallet}
            tab={screen.tab}
            onTabChange={(tab) => void screen.setTab(tab)}
            onFreeze={screen.actions.freeze}
            onUnfreeze={screen.actions.unfreeze}
            onAdjust={screen.actions.adjust}
          />
        )}
      </QueryView>
    </>
  )
}
