"use client"

import { DetailScreen } from "@/features/admin/shell/ui/detail-screen"
import { WalletDetail } from "@/features/admin/wallet/components/wallet-detail"
import {
  useWallet,
  useWalletMutations,
} from "@/features/admin/wallet/hooks/use-wallet"

export function WalletDetailScreen({ userId }: { userId: string }) {
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
