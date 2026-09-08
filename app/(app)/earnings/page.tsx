import type { Metadata } from "next"
import { EarningsScreen } from "@/features/earnings/screens/earnings-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Monetisation" }

export default async function Page() {
  await requireSession("/earnings")

  return <EarningsScreen />
}
