"use client"

import { MegaphoneIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { CampaignRow } from "../components/list/campaign-row"
import { CampaignRowSkeleton } from "../components/list/campaign-row-skeleton"
import { PromotionsOff } from "../components/promotions-off"
import { usePromotionsScreen } from "../hooks/use-promotions-screen"

export function PromotionsScreen() {
  const screen = usePromotionsScreen()

  return (
    <>
      <BackHeader title="Your promotions" onBack={screen.onBack} />

      {screen.enabled === false ? (
        <PromotionsOff />
      ) : screen.loading ? (
        <SkeletonRows count={6} item={CampaignRowSkeleton} />
      ) : screen.failed ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load your promotions"
            onRetry={screen.retry}
          />
        </div>
      ) : screen.rows.length === 0 ? (
        <EmptyState
          icon={MegaphoneIcon}
          title="No promotions yet"
          description="Open the menu on one of your snaccs and pick Promote to show it to more people."
          className="py-24"
        />
      ) : (
        <>
          {screen.rows.map((row) => (
            <CampaignRow
              key={row.campaign.id}
              campaign={row.campaign}
              status={row.status}
            />
          ))}
          <LoadMore onReach={screen.loadMore} disabled={screen.loadingMore} />
          <ListFooter loading={screen.loadingMore} />
        </>
      )}
    </>
  )
}
