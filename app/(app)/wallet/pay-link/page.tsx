import type { Metadata } from "next"
import { PayLinkScreen } from "@/features/wallet/screens/pay-link-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Your pay link" }

export default async function Page() {
  await requireSession("/wallet/pay-link")

  return <PayLinkScreen />
}
