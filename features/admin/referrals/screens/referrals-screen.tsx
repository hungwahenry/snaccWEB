"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { ReferralsTable } from "../components/referrals-table"
import { useReferralsScreen } from "../hooks/use-referrals-screen"
import { STATUS_OPTIONS } from "../utils/status"

export function ReferralsScreen() {
  const { list, query, actions } = useReferralsScreen()

  return (
    <>
      <PageHeader
        title="Referrals"
        description="Friends people brought in, and whether the pair got paid. Held ones need a look before they pay."
      />
      <ReferralsTable
        query={query}
        onPageChange={list.setPage}
        onApprove={actions.approve}
        onVoid={(id, reason) => actions.close({ id, reason })}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <OptionSelect
              label="Status"
              allLabel="Any status"
              value={list.values.status}
              onChange={(status) => list.setFilter({ status })}
              options={STATUS_OPTIONS}
            />
          </TableToolbar>
        }
      />
    </>
  )
}
