import Link from "next/link"
import { LazyImage } from "@/components/ui/lazy-image"
import { cashtagPath } from "../routes"
import type { Cashtag } from "../types"
import { changeTone, formatNgnPrice, formatUsd } from "../utils/price"
import { CashtagChange } from "./cashtag-change"
import { Sparkline } from "./sparkline"

export function CashtagCard({ cashtag }: { cashtag: Cashtag }) {
  const weekTone = changeTone(cashtag.change_7d_pct ?? cashtag.change_24h_pct)

  return (
    <Link
      href={cashtagPath(cashtag.symbol)}
      onClick={(event) => event.stopPropagation()}
      className="flex items-center gap-3 rounded-2xl border border-border py-3 pl-3.5 transition-colors hover:bg-accent/40"
    >
      {cashtag.image_url ? (
        <LazyImage
          src={cashtag.image_url}
          alt=""
          width={28}
          height={28}
          className="size-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
          {cashtag.symbol.slice(0, 1)}
        </span>
      )}

      <div className="flex min-w-0 shrink flex-col gap-0.5">
        <p className="truncate text-sm text-foreground">
          <span className="font-bold">{cashtag.name}</span>
          <span className="text-xs text-muted-foreground">
            {"  "}${cashtag.symbol}
            {cashtag.rank !== null ? ` · #${cashtag.rank}` : ""}
          </span>
        </p>
        <p className="truncate text-base text-foreground">
          <span className="font-extrabold tabular-nums">
            {formatUsd(cashtag.price_usd)}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {"  "}
            {formatNgnPrice(cashtag.price_ngn)}
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-x-3">
          <CashtagChange label="24h" pct={cashtag.change_24h_pct} />
          <CashtagChange label="7d" pct={cashtag.change_7d_pct} />
        </div>
      </div>

      {cashtag.sparkline.length > 1 ? (
        <div className="min-w-24 flex-1">
          <Sparkline
            values={cashtag.sparkline}
            tone={weekTone}
            width={192}
            height={36}
            className="h-9 w-full"
          />
        </div>
      ) : null}
    </Link>
  )
}
