"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { BenefitsTable } from "../components/benefits-table"
import { PremiumStatsPanel } from "../components/premium-stats"
import { SubscribersTable } from "../components/subscribers-table"
import { usePremiumScreen } from "../hooks/use-premium-screen"

export function PremiumScreen() {
  const { list, subscribers, stats, benefits, actions } = usePremiumScreen()

  return (
    <>
      <PageHeader
        title="Premium"
        description="Who subscribes, how they pay, and what the paywall says. Subscriptions are written by RevenueCat's webhook — nothing here charges anyone, and granting Premium by hand is recorded as promotional so it never counts as revenue."
      />
      <div className="flex flex-col gap-6">
        <PremiumStatsPanel query={stats} />
        <SubscribersTable
          query={subscribers}
          onPageChange={list.setPage}
          onGrant={actions.grant}
          onRevoke={actions.revoke}
          toolbar={
            <TableToolbar onReset={list.filtered ? list.reset : undefined}>
              <SearchField
                value={list.values.q}
                onChange={(q) => list.setFilter({ q })}
                placeholder="Search by name"
              />
            </TableToolbar>
          }
        />
        <BenefitsTable
          query={benefits}
          onSave={actions.saveBenefit}
          onSetShown={actions.setBenefitShown}
        />
      </div>
    </>
  )
}
