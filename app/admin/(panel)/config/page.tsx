import type { Metadata } from "next"
import { ConfigScreen } from "@/features/admin/config/screens/config-screen"

export const metadata: Metadata = { title: "Config" }

export default function Page() {
  return <ConfigScreen />
}
