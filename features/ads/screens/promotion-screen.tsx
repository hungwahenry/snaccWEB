"use client"

import { MegaphoneOffIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import { CampaignControls } from "../components/detail/campaign-controls"
import { CampaignOverview } from "../components/detail/campaign-overview"
import { CampaignResults } from "../components/detail/campaign-results"
import { PromotionSkeleton } from "../components/detail/promotion-skeleton"
import { RejectionCard } from "../components/detail/rejection-card"
import { TopUpSheet } from "../components/detail/top-up-sheet"
import { CampaignTimeSheet } from "../components/form/campaign-time-sheet"
import { PromotionsOff } from "../components/promotions-off"
import { SetupRows } from "../components/setup-rows"
import { usePromotionControls } from "../hooks/use-promotion-controls"
import { usePromotionScreen } from "../hooks/use-promotion-screen"
import type { Campaign } from "../types"

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

          <Controls campaign={view.campaign} />

          <CampaignResults campaign={view.campaign} />

          <div className="flex flex-col gap-3">
            <Eyebrow>Snacc</Eyebrow>
            <QuotedSnacc snacc={view.preview} onPress={screen.onOpenSnacc} />
          </div>

          <SetupRows title="How it's set up" rows={view.setup} />
        </div>
      )}
    </>
  )
}

function Controls({ campaign }: { campaign: Campaign }) {
  const { timeSheet, topUpSheet, ...controls } = usePromotionControls(campaign)

  return (
    <>
      <CampaignControls {...controls} />
      <CampaignTimeSheet {...timeSheet} />
      <TopUpSheet {...topUpSheet} />
    </>
  )
}
