import type { Metadata } from "next"
import { OpsScreen } from "@/features/admin/ops/screens/ops-screen"

export const metadata: Metadata = { title: "Ops" }

export default function Page() {
  return <OpsScreen />
}
