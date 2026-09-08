import type { Metadata } from "next"
import { WithdrawalsScreen } from "@/features/admin/withdrawals/screens/withdrawals-screen"

export const metadata: Metadata = { title: "Withdrawals" }

export default function Page() {
  return <WithdrawalsScreen />
}
