"use client"

import { PageHeader } from "@/components/page-header"
import { WalletAccountsView } from "@/features/admin/wallet/wallet-accounts-view"
import { WalletSummaryCards } from "@/features/admin/wallet/wallet-summary-cards"

export default function WalletPage() {
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
