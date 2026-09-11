import type { Metadata } from "next"
import { ExportDataScreen } from "@/features/account/screens/export-data-screen"
import { EXPORT_DATA_PATH } from "@/features/account/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Download your data" }

export default async function Page() {
  await requireSession(EXPORT_DATA_PATH)

  return <ExportDataScreen />
}
