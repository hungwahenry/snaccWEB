import type { Metadata } from "next"
import { SnaccDetailScreen } from "@/features/admin/snaccs/screens/snacc-detail-screen"

export const metadata: Metadata = { title: "Snacc" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <SnaccDetailScreen id={id} />
}
