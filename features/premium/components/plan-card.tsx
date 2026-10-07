import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { payPath } from "@/features/wallet/routes"
import { cn } from "@/lib/utils"
import type { PlanTerms } from "../utils/plan-copy"

export function PlanCard({
  terms,
  featured,
  affordable,
  busy,
  loading,
  onBuy,
}: {
  terms: PlanTerms
  featured: boolean
  affordable: boolean
  busy: boolean
  loading: boolean
  onBuy: () => void
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-background/85 p-4",
        featured ? "border-2 border-premium" : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-base font-bold text-foreground">{terms.title}</p>
          <p className="text-[13px] text-muted-foreground">
            {terms.perMonth
              ? `${terms.length} · ${terms.perMonth}`
              : terms.length}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-lg font-extrabold text-foreground tabular-nums">
            {terms.price}
          </p>
          <p className="text-[13px] text-muted-foreground">per {terms.per}</p>
        </div>
      </div>

      <p className="text-[13px] leading-[18px] text-muted-foreground">
        {terms.summary}
      </p>

      {affordable ? (
        <Button
          size="lg"
          variant={featured ? "default" : "outline"}
          disabled={busy}
          onClick={onBuy}
        >
          {loading ? <Spinner /> : "Buy"}
        </Button>
      ) : (
        <Button
          size="lg"
          variant="outline"
          render={<Link href={payPath({ mode: "topup" })} />}
        >
          Top up to buy
        </Button>
      )}
    </div>
  )
}
