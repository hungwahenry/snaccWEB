import type { Metadata } from "next"
import { SnaccsScreen } from "@/features/admin/snaccs/screens/snaccs-screen"

export const metadata: Metadata = { title: "Snaccs" }

export default function Page() {
  return <SnaccsScreen />
}
