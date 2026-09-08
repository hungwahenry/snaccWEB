import type { Metadata } from "next"
import { SuspensionReasonsScreen } from "@/features/admin/suspension-reasons/screens/suspension-reasons-screen"

export const metadata: Metadata = { title: "Suspension reasons" }

export default function Page() {
  return <SuspensionReasonsScreen />
}
