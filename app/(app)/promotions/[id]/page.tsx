import type { Metadata } from "next"
import { promotionPath } from "@/features/ads/routes"
import { PromotionScreen } from "@/features/ads/screens/promotion-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Promotion" }

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  await requireSession(promotionPath(id))
  return <PromotionScreen id={id} />
}
