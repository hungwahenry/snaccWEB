import type { Metadata } from "next"
import { NEW_PROMOTION_PATH, newPromotionPath } from "@/features/ads/routes"
import { NewPromotionScreen } from "@/features/ads/screens/new-promotion-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Promote" }

type Props = { searchParams: Promise<{ snacc?: string }> }

export default async function Page({ searchParams }: Props) {
  const { snacc } = await searchParams
  await requireSession(snacc ? newPromotionPath(snacc) : NEW_PROMOTION_PATH)
  return <NewPromotionScreen key={snacc ?? ""} snaccId={snacc || null} />
}
