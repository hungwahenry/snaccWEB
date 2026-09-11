import type { Metadata } from "next"
import { BlockedAccountsScreen } from "@/features/blocks/screens/blocked-accounts-screen"
import { BLOCKED_PATH } from "@/features/blocks/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Blocked accounts" }

export default async function BlockedAccountsPage() {
  await requireSession(BLOCKED_PATH)
  return <BlockedAccountsScreen />
}
