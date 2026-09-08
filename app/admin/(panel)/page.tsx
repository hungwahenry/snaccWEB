import type { Metadata } from "next"
import { DashboardScreen } from "@/features/admin/dashboard/screens/dashboard-screen"

export const metadata: Metadata = { title: "Dashboard" }

export default function Page() {
  return <DashboardScreen />
}
