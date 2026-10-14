import type { Metadata } from "next"
import { LedgerScreen } from "@/features/admin/wallet/screens/ledger-screen"

export const metadata: Metadata = { title: "Ledger" }

export default function Page() {
  return <LedgerScreen />
}
