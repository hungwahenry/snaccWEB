import { LazyImage } from "@/components/ui/lazy-image"
import { timeAgo } from "@/lib/format"
import type { Cashtag } from "../types"
import {
  changeTone,
  formatNgnPrice,
  formatUsd,
  formatUsdCompact,
} from "../utils/price"
import { CashtagChange } from "./cashtag-change"
import { Sparkline } from "./sparkline"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-bold text-foreground tabular-nums">
        {value}
      </dd>
    </div>
  )
}

export function CashtagHeader({ cashtag }: { cashtag: Cashtag }) {
  const weekTone = changeTone(cashtag.change_7d_pct ?? cashtag.change_24h_pct)

  return (
    <section className="border-b border-border pb-4">
      <div className="flex items-center gap-3 px-4 pt-3">
        {cashtag.image_url ? (
          <LazyImage
            src={cashtag.image_url}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-base font-bold text-foreground">
            {cashtag.symbol.slice(0, 1)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-foreground">
            {cashtag.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            ${cashtag.symbol}
            {cashtag.rank !== null ? ` · Rank #${cashtag.rank}` : ""}
          </p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <p className="text-3xl font-extrabold text-foreground tabular-nums">
          {formatUsd(cashtag.price_usd)}
        </p>
        <p className="text-sm text-muted-foreground tabular-nums">
          {formatNgnPrice(cashtag.price_ngn)}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 pt-1">
          <CashtagChange
            label="24h"
            pct={cashtag.change_24h_pct}
            className="text-sm"
          />
          <CashtagChange
            label="7d"
            pct={cashtag.change_7d_pct}
            className="text-sm"
          />
        </div>
      </div>

      {cashtag.sparkline.length > 1 ? (
        <div className="pt-3">
          <Sparkline
            values={cashtag.sparkline}
            tone={weekTone}
            width={600}
            height={96}
            className="h-24 w-full"
          />
        </div>
      ) : null}

      <dl className="grid grid-cols-2 gap-y-3 px-4 pt-3">
        <Stat label="24h high" value={formatUsd(cashtag.high_24h_usd)} />
        <Stat label="24h low" value={formatUsd(cashtag.low_24h_usd)} />
        <Stat
          label="Market cap"
          value={formatUsdCompact(cashtag.market_cap_usd)}
        />
        <Stat
          label="Updated"
          value={cashtag.quoted_at ? timeAgo(cashtag.quoted_at) : "—"}
        />
      </dl>
    </section>
  )
}
