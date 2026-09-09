"use client"

import { CircleSlashIcon, GemIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useWalletOverview } from "@/features/wallet/hooks/account/use-wallet-overview"
import { useBack } from "@/hooks/use-back"
import { BenefitList } from "../components/benefit-list"
import { PlanChoice } from "../components/plan-choice"
import { PremiumSkeleton } from "../components/premium-skeleton"
import { PremiumStatus } from "../components/premium-status"
import { useBuyPremium } from "../hooks/use-buy-premium"
import { usePremium } from "../hooks/use-premium"

export function PremiumScreen() {
  const back = useBack()
  const enabled = useFlagWhenKnown("premium")
  const query = usePremium()
  const wallet = useWalletOverview()
  const { buy, buying } = useBuyPremium()

  const premium = query.data
  // Nothing to sell someone who has it for life, and the server refuses it anyway.
  const plans = premium?.lifetime ? null : premium?.wallet_plans

  return (
    <>
      <BackHeader title="Premium" onBack={back} />

      {/* Reachable directly even while the row that leads here is hidden, so say something. */}
      {enabled === null ? (
        <PremiumSkeleton />
      ) : !enabled ? (
        <EmptyState
          icon={CircleSlashIcon}
          title="Not available"
          description="Premium is off right now. Try again later."
        />
      ) : query.isPending ? (
        <PremiumSkeleton />
      ) : query.isError || !premium ? (
        <p className="p-4 text-sm text-muted-foreground">
          Couldn&apos;t load Premium.
        </p>
      ) : (
        <div className="flex flex-col gap-6 p-4">
          {premium.active ? (
            <PremiumStatus premium={premium} />
          ) : (
            <div className="rounded-xl border p-4">
              <GemIcon className="size-5 text-primary" />
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                Snacc has no ads and no investors. Premium is what pays for it.
              </p>
            </div>
          )}

          {plans && plans.length > 0 ? (
            <PlanChoice
              plans={plans}
              balance={wallet.data?.balance ?? 0}
              buying={buying}
              onBuy={buy}
            />
          ) : null}

          <BenefitList benefits={premium.benefits} />
        </div>
      )}
    </>
  )
}
