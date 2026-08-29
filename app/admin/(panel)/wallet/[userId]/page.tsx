"use client"

import { use } from "react"
import { DetailScreen } from "@/components/admin/detail-screen"
import { WalletDetail } from "@/features/admin/wallet/wallet-detail"
import {
  useWallet,
  useWalletMutations,
} from "@/features/admin/wallet/use-wallet"

export default function WalletDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = use(params)
  const query = useWallet(userId)
  const actions = useWalletMutations(userId)

  return (
    <DetailScreen
      backHref="/admin/wallet"
      backLabel="Back to wallets"
      missing="This user has no wallet yet."
      query={query}
    >
      {(wallet) => <WalletDetail wallet={wallet} actions={actions} />}
    </DetailScreen>
  )
}
