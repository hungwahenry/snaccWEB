import type { Metadata } from "next"
import { CampusImportScreen } from "@/features/admin/campus-imports/screens/campus-import-screen"

export const metadata: Metadata = { title: "Campus import" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CampusImportScreen id={id} />
}
