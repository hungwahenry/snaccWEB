import type { Metadata } from "next"
import { LimitsScreen } from "@/features/wallet/screens/limits-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Your limits" }

export default async function Page() {
  await requireSession("/wallet/limits")

  return <LimitsScreen />
}
