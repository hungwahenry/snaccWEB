"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { WalletAccountsView } from "@/features/admin/wallet/components/wallet-accounts-view"
import { WalletSummaryCards } from "@/features/admin/wallet/components/wallet-summary-cards"

export function WalletsScreen() {
  return (
    <>
      <PageHeader
        title="Wallets"
        description="Spendable balances, and every posting that produced them."
      />
      <div className="flex flex-col gap-6">
        <WalletSummaryCards />
        <WalletAccountsView />
      </div>
    </>
  )
}
