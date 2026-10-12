import type { Metadata } from "next"
import { AdDetailScreen } from "@/features/admin/ads/screens/ad-detail-screen"

export const metadata: Metadata = { title: "Promotion" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AdDetailScreen id={id} />
}
