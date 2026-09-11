"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { DriftPanel } from "../components/drift-panel"
import { HealthPanel } from "../components/health-panel"
import { QueuesTable } from "../components/queues-table"
import { SettlementPanel } from "../components/settlement-panel"
import { useOpsScreen } from "../hooks/use-ops-screen"

export function OpsScreen() {
  const { health, queues, drift, actions } = useOpsScreen()

  return (
    <>
      <PageHeader
        title="Health and drift"
        description="How the server is doing, what the background jobs are up to, and whether the numbers still add up."
      />
      <div className="flex flex-col gap-6">
        <HealthPanel query={health} />
        <QueuesTable
          query={queues}
          driver={health.data?.queue_driver}
          onRetry={actions.retry}
        />
        <SettlementPanel onReconcile={actions.reconcile} />
        <DriftPanel query={drift} onRepair={actions.repair} />
      </div>
    </>
  )
}
