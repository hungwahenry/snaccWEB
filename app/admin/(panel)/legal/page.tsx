import type { Metadata } from "next"
import { LegalScreen } from "@/features/admin/legal/screens/legal-screen"

export const metadata: Metadata = { title: "Legal" }

export default function Page() {
  return <LegalScreen />
}
