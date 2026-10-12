"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatNumber } from "@/lib/format"
import type { AdStatusFilter, AdStatusTab } from "../types"

export function StatusTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: AdStatusTab[]
  value: AdStatusFilter
  onChange: (value: AdStatusFilter) => void
}) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {tab.count !== null ? (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatNumber(tab.count)}
                </span>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  )
}
