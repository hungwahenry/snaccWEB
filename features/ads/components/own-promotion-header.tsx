"use client"

import { MegaphoneIcon } from "lucide-react"
import Link from "next/link"
import { useNow } from "@/hooks/use-now"
import { MINUTE_MS } from "@/lib/duration"
import { promotionPath } from "../routes"
import type { OwnPromotion } from "../types"
import { ownPromotionLabel } from "../utils/own-promotion"

export function OwnPromotionHeader({ promotion }: { promotion: OwnPromotion }) {
  const now = useNow(MINUTE_MS)

  return (
    <Link
      href={promotionPath(promotion.campaign_id)}
      onClick={(event) => event.stopPropagation()}
      className="flex items-center gap-1.5 pl-14 hover:underline"
    >
      <MegaphoneIcon className="size-4 text-muted-foreground" />
      <span className="text-sm font-bold text-muted-foreground">
        {ownPromotionLabel(promotion, now)}
      </span>
    </Link>
  )
}
