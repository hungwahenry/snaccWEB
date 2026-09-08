import type { Metadata } from "next"
import { ReportDetailScreen } from "@/features/admin/reports/screens/report-detail-screen"

export const metadata: Metadata = { title: "Report" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ReportDetailScreen id={id} />
}
