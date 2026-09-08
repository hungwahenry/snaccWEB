import type { Metadata } from "next"
import { BlockedAccountsScreen } from "@/features/blocks/screens/blocked-accounts-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Blocked accounts" }

export default async function BlockedAccountsPage() {
  await requireSession("/settings/blocked")
  return <BlockedAccountsScreen />
}
