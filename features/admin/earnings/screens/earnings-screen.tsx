"use client"

import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { EarningsTable } from "../components/earnings-table"
import { FundDialog } from "../components/fund-dialog"
import { FundsTable } from "../components/funds-table"
import { useEarningsScreen } from "../hooks/use-earnings-screen"

export function EarningsScreen() {
  const { list, earnings, types, funds, provision, actions } =
    useEarningsScreen()

  return (
    <>
      <PageHeader
        title="Earnings"
        description="Campus funds and the creator earnings ledger."
      />
      <div className="flex flex-col gap-6">
        <FundsTable
          query={funds}
          onAdjust={actions.adjust}
          actions={
            <CanAct permission="earnings.manage_funds">
              <FundDialog
                campuses={provision.options}
                disabled={provision.loading}
                trigger={<Button size="sm">Provision fund</Button>}
                onSubmit={actions.provision}
              />
            </CanAct>
          }
        />
        <EarningsTable
          query={earnings}
          onPageChange={list.setPage}
          toolbar={
            <TableToolbar onReset={list.filtered ? list.reset : undefined}>
              <OptionSelect
                label="Type"
                allLabel="All types"
                value={list.values.type}
                onChange={(type) => list.setFilter({ type })}
                options={types.options}
                disabled={types.loading}
              />
            </TableToolbar>
          }
        />
      </div>
    </>
  )
}
