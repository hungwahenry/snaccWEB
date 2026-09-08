import type { Metadata } from "next"
import { WithdrawalDetailScreen } from "@/features/admin/withdrawals/screens/withdrawal-detail-screen"

export const metadata: Metadata = { title: "Withdrawal" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <WithdrawalDetailScreen id={id} />
}
