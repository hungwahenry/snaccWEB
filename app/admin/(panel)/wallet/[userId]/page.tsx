import type { Metadata } from "next"
import { WalletDetailScreen } from "@/features/admin/wallet/screens/wallet-detail-screen"

export const metadata: Metadata = { title: "Wallet" }

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  return <WalletDetailScreen userId={userId} />
}
