import type { Metadata } from "next"
import { ReferralsScreen } from "@/features/admin/referrals/screens/referrals-screen"

export const metadata: Metadata = { title: "Referrals" }

export default function Page() {
  return <ReferralsScreen />
}
