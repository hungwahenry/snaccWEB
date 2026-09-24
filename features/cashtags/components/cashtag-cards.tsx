"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import type { Cashtag } from "../types"
import { CashtagCard } from "./cashtag-card"

export function CashtagCards({
  cashtags,
}: {
  cashtags: Cashtag[] | undefined
}) {
  const enabled = useFlag("cashtags")
  if (!enabled || !cashtags || cashtags.length === 0) return null

  return (
    <div className="flex flex-col gap-2 pt-1">
      {cashtags.map((cashtag) => (
        <CashtagCard key={cashtag.id} cashtag={cashtag} />
      ))}
    </div>
  )
}
