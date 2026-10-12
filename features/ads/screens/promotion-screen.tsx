"use client"

import { MegaphoneOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { BackHeader } from "@/features/navigation/components/back-header"
import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import { CampaignOverview } from "../components/detail/campaign-overview"
import { CampaignResults } from "../components/detail/campaign-results"
import { CampaignSetup } from "../components/detail/campaign-setup"
import { PromotionSkeleton } from "../components/detail/promotion-skeleton"
import { RejectionCard } from "../components/detail/rejection-card"
import { PromotionsOff } from "../components/promotions-off"
import { usePromotionScreen } from "../hooks/use-promotion-screen"

export function PromotionScreen({ id }: { id: string }) {
  const screen = usePromotionScreen(id)
  const { view } = screen

  return (
    <>
      <BackHeader title="Promotion" onBack={screen.onBack} />

      {screen.enabled === false ? (
        <PromotionsOff />
      ) : screen.loading ? (
        <PromotionSkeleton />
      ) : screen.gone ? (
        <EmptyState
          icon={MegaphoneOffIcon}
          title="Promotion not found"
          description="It isn't one of yours, or it no longer exists."
          className="py-24"
        />
      ) : !view ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load this promotion"
            onRetry={screen.retry}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-7 px-5 pt-5 pb-10">
          <CampaignOverview
            campaign={view.campaign}
            status={view.status}
            note={view.note}
          />

          {view.campaign.rejection ? (
            <RejectionCard rejection={view.campaign.rejection} />
          ) : null}

          <CampaignResults campaign={view.campaign} />

          <div className="flex flex-col gap-3">
            <Eyebrow>Snacc</Eyebrow>
            <QuotedSnacc snacc={view.preview} onPress={screen.onOpenSnacc} />
          </div>

          <CampaignSetup campaign={view.campaign} />

          {view.stoppable ? (
            <Button
              variant="destructive"
              size="lg"
              className="h-12 w-full"
              disabled={screen.stopping}
              onClick={screen.onStop}
            >
              {screen.stopping ? <Spinner /> : "Stop promotion"}
            </Button>
          ) : null}
        </div>
      )}
    </>
  )
}
