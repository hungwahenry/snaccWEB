"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { payPath } from "@/features/wallet/routes"
import { formatNaira } from "@/lib/format"
import type { PremiumPlan, PremiumWalletPlan } from "../types"
import { PLAN_LABELS } from "../utils/icons"

export function PlanChoice({
  plans,
  balance,
  buying,
  onBuy,
}: {
  plans: PremiumWalletPlan[]
  balance: number
  buying: PremiumPlan | null
  onBuy: (plan: PremiumWalletPlan) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {plans.map((plan) => {
        const affordable = balance >= plan.price_kobo
        const pending = buying === plan.plan

        return (
          <div
            key={plan.plan}
            className="flex items-center justify-between gap-4 rounded-xl border p-4"
          >
            <div>
              <p className="text-sm font-medium">
                {PLAN_LABELS[plan.plan] ?? plan.plan}
              </p>
              <p className="text-sm text-muted-foreground tabular-nums">
                {formatNaira(plan.price_kobo)}
              </p>
            </div>

            {affordable ? (
              <Button disabled={buying !== null} onClick={() => onBuy(plan)}>
                {pending ? <Spinner /> : "Buy"}
              </Button>
            ) : (
              <Button
                variant="outline"
                render={<Link href={payPath({ mode: "topup" })} />}
              >
                Top up
              </Button>
            )}
          </div>
        )
      })}

      <p className="text-xs text-muted-foreground">
        Paid from your Snacc balance, which is {formatNaira(balance)}. It does
        not renew on its own — buy again whenever you want more.
      </p>
    </div>
  )
}
