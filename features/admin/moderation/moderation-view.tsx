"use client"

import { useState } from "react"
import { Stat, StatGrid } from "@/components/admin/detail"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatNumber } from "@/lib/format"
import { CategoriesTable } from "./categories-table"
import { RulesTable } from "./rules-table"
import { ScansTable } from "./scans-table"
import { SurfacesTable } from "./surfaces-table"
import { TuneSheet } from "./tune-sheet"
import {
  useCategories,
  useModerationMutations,
  useRules,
  useScans,
  useSummary,
  useSurfaces,
} from "./use-moderation"
import type { ModerationRule } from "./index"

export function ModerationView() {
  const surfaces = useSurfaces()
  const rules = useRules()
  const categories = useCategories()
  const summary = useSummary()
  const mutations = useModerationMutations()

  const [ruleSurface, setRuleSurface] = useState("all")
  const [verdict, setVerdict] = useState("all")
  const [page, setPage] = useState(1)
  const [tuning, setTuning] = useState<ModerationRule | null>(null)

  const scans = useScans({
    page,
    ...(verdict === "all" ? {} : { verdict }),
  })

  if (surfaces.isPending || rules.isPending) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    )
  }

  const byVerdict = summary.data?.by_surface ?? []
  const reviewed = byVerdict.reduce((total, row) => total + row.count, 0)
  const acted = byVerdict
    .filter((row) => row.verdict !== "allow")
    .reduce((total, row) => total + row.count, 0)
  const live = (surfaces.data ?? []).filter((row) => row.enabled).length
  const unruled = (categories.data ?? []).filter(
    (entry) => entry.ruled.length === 0
  ).length

  return (
    <div className="flex flex-col gap-6">
      <StatGrid columns={4}>
        <Stat label="Reviewed" value={formatNumber(reviewed)} />
        <Stat label="Today" value={formatNumber(summary.data?.today ?? 0)} />
        <Stat
          label="Would act"
          value={formatNumber(acted)}
          hint="verdicts above allow"
        />
        <Stat
          label="Surfaces on"
          value={`${live} of ${surfaces.data?.length ?? 0}`}
          hint={
            summary.data?.failures
              ? `${formatNumber(summary.data.failures)} reviews failed`
              : undefined
          }
        />
      </StatGrid>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="surfaces">Surfaces</TabsTrigger>
          <TabsTrigger value="categories">
            Categories{unruled > 0 ? ` (${unruled} unused)` : ""}
          </TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="pt-4">
          <RulesTable
            rules={rules.data ?? []}
            mutations={mutations}
            surface={ruleSurface}
            onSurface={setRuleSurface}
            onTune={setTuning}
          />
        </TabsContent>

        <TabsContent value="surfaces" className="pt-4">
          <SurfacesTable surfaces={surfaces.data ?? []} mutations={mutations} />
        </TabsContent>

        <TabsContent value="categories" className="pt-4">
          <CategoriesTable categories={categories.data ?? []} />
        </TabsContent>

        <TabsContent value="reviews" className="pt-4">
          {scans.data ? (
            <ScansTable
              data={scans.data}
              verdict={verdict}
              onVerdict={(next) => {
                setVerdict(next)
                setPage(1)
              }}
              onPage={setPage}
            />
          ) : (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TuneSheet rule={tuning} onClose={() => setTuning(null)} />
    </div>
  )
}
