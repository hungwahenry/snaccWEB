"use client"

import { CircleSlashIcon } from "lucide-react"
import Link from "next/link"
import { Rise } from "@/components/motion/rise"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useWalletOverview } from "@/features/wallet/hooks/account/use-wallet-overview"
import { useBack } from "@/hooks/use-back"
import { formatNaira } from "@/lib/format"
import { PRIVACY_PATH, TERMS_PATH } from "@/lib/routes"
import { BenefitGrid } from "../components/benefit-grid"
import { PlanCard } from "../components/plan-card"
import { PremiumHeadline } from "../components/premium-headline"
import { PremiumPreview } from "../components/premium-preview"
import { PremiumSkeleton } from "../components/premium-skeleton"
import { useBuyPremium } from "../hooks/use-buy-premium"
import { usePremium } from "../hooks/use-premium"
import { usePremiumPreview } from "../hooks/use-premium-preview"
import { standingLine, walletPlanTerms } from "../utils/plan-copy"

export function PremiumScreen() {
  const back = useBack()
  const enabled = useFlagWhenKnown("premium")
  const query = usePremium()
  const wallet = useWalletOverview()
  const preview = usePremiumPreview()
  const { buy, buying } = useBuyPremium()

  const premium = query.data
  const plans = premium?.lifetime ? null : premium?.wallet_plans
  const balance = wallet.data?.balance ?? 0

  return (
    <div className="premium-sky min-h-dvh">
      <BackHeader title="Premium" onBack={back} />

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
        <div className="flex flex-col gap-6 px-5 pt-5 pb-10">
          <Rise>
            <PremiumPreview
              {...preview}
              active={premium.active}
              benefits={premium.benefits}
            />
          </Rise>

          <Rise delay={100} className="flex flex-col gap-3">
            <PremiumHeadline
              active={premium.active}
              avatarUrl={preview.avatarUrl}
              name={preview.username ?? preview.displayName}
            />
            <p className="max-w-[340px] text-base leading-6 text-muted-foreground">
              {standingLine(premium)}
            </p>
          </Rise>

          <Rise delay={200}>
            <BenefitGrid benefits={premium.benefits} />
          </Rise>

          {plans && plans.length > 0 ? (
            <Rise delay={300} className="flex flex-col gap-3">
              <Eyebrow>
                {premium.active ? "Add more time" : "Choose a plan"}
              </Eyebrow>

              {plans.map((plan, index) => (
                <PlanCard
                  key={plan.plan}
                  terms={walletPlanTerms(plan)}
                  featured={index === 0}
                  affordable={balance >= plan.price_kobo}
                  busy={buying !== null}
                  loading={buying === plan.plan}
                  onBuy={() => buy(plan)}
                />
              ))}

              <p className="text-center text-xs leading-[17px] text-muted-foreground">
                Paid from your Snacc balance, which is {formatNaira(balance)}.
                Premium doesn&apos;t renew on its own, so buy again whenever you
                want more.
              </p>

              <div className="flex items-center justify-center gap-4 text-[13px] text-muted-foreground">
                <Link href={TERMS_PATH} className="underline">
                  Terms of Use
                </Link>
                <Link href={PRIVACY_PATH} className="underline">
                  Privacy Policy
                </Link>
              </div>
            </Rise>
          ) : null}
        </div>
      )}
    </div>
  )
}
