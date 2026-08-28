"use client"

import { use } from "react"
import { PageHeader } from "@/components/page-header"
import { WalletDetailView } from "@/features/admin/wallet/wallet-detail-view"

export default function WalletDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = use(params)

  return (
    <>
      <PageHeader
        title="Wallet"
        description="One holder, and every movement."
      />
      <WalletDetailView userId={userId} />
    </>
  )
}
