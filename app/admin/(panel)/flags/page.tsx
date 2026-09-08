import type { Metadata } from "next"
import { FlagsScreen } from "@/features/admin/feature-flags/screens/flags-screen"

export const metadata: Metadata = { title: "Feature flags" }

export default function Page() {
  return <FlagsScreen />
}
