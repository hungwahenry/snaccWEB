"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { LoadingBlock } from "@/features/admin/shell/components/query-view"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { CategoriesTable } from "../components/categories-table"
import { ModerationStats } from "../components/moderation-stats"
import { RulesTable } from "../components/rules-table"
import { ScansTable } from "../components/scans-table"
import { SurfacesTable } from "../components/surfaces-table"
import { TuneSheet } from "../components/tune-sheet"
import { useModerationScreen } from "../hooks/use-moderation-screen"
import { VERDICT_OPTIONS } from "../utils/actions"
import { SURFACE_OPTIONS } from "../utils/surfaces"

export function ModerationScreen() {
  const screen = useModerationScreen()
  const { totals, rules, scans, tuning, actions } = screen

  return (
    <>
      <PageHeader
        title="Automatic review"
        description="What the classifier looks at, what its scores mean, and what it has decided so far."
      />
      {screen.loading ? (
        <LoadingBlock className="py-24" />
      ) : (
        <div className="flex flex-col gap-6">
          <ModerationStats totals={totals} />

          <Tabs value={screen.tab} onValueChange={screen.setTab}>
            <TabsList>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="surfaces">Surfaces</TabsTrigger>
              <TabsTrigger value="categories">
                Categories
                {totals.unruled > 0 ? ` (${totals.unruled} unused)` : ""}
              </TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="pt-4">
              <RulesTable
                query={rules.query}
                surface={rules.surface}
                categories={screen.categories.data ?? []}
                onTune={tuning.open}
                onSave={actions.saveRule}
                onSetRetired={actions.setRuleRetired}
                toolbar={
                  <TableToolbar
                    onReset={
                      rules.surface ? () => rules.setSurface(null) : undefined
                    }
                  >
                    <OptionSelect
                      label="Surface"
                      value={rules.surface}
                      onChange={rules.setSurface}
                      options={SURFACE_OPTIONS}
                      allLabel="All surfaces"
                      className="w-48"
                    />
                  </TableToolbar>
                }
              />
            </TabsContent>

            <TabsContent value="surfaces" className="pt-4">
              <SurfacesTable
                query={screen.surfaces}
                onSetEnabled={actions.setSurfaceEnabled}
                onSetMode={actions.setSurfaceMode}
              />
            </TabsContent>

            <TabsContent value="categories" className="pt-4">
              <CategoriesTable query={screen.categories} />
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <ScansTable
                query={scans.query}
                onPageChange={scans.list.setPage}
                toolbar={
                  <TableToolbar
                    onReset={scans.list.filtered ? scans.list.reset : undefined}
                  >
                    <OptionSelect
                      label="Verdict"
                      value={scans.list.values.verdict}
                      onChange={(verdict) => scans.list.setFilter({ verdict })}
                      options={VERDICT_OPTIONS}
                      allLabel="All verdicts"
                    />
                  </TableToolbar>
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
      <TuneSheet
        rule={tuning.rule}
        insight={tuning.insight}
        onClose={tuning.close}
      />
    </>
  )
}
