import type { Metadata } from "next"
import { ReportReasonsScreen } from "@/features/admin/report-reasons/screens/report-reasons-screen"

export const metadata: Metadata = { title: "Report reasons" }

export default function Page() {
  return <ReportReasonsScreen />
}
