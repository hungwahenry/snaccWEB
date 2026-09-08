import type { Metadata } from "next"
import { MyReportsScreen } from "@/features/reports/screens/my-reports-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Your reports" }

export default async function MyReportsPage() {
  await requireSession("/settings/reports")
  return <MyReportsScreen />
}
