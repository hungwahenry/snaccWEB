"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { DeliveriesPanel } from "../components/deliveries-panel"
import { WebhookPayloadDialog } from "../components/webhook-payload-dialog"
import { WebhooksTable } from "../components/webhooks-table"
import { useWebhooksScreen } from "../hooks/use-webhooks-screen"
import { PROVIDER_OPTIONS, STATUS_OPTIONS } from "../utils/webhooks"

export function WebhooksScreen() {
  const { list, events, stats, payload } = useWebhooksScreen()

  return (
    <>
      <PageHeader
        title="Webhooks"
        description="Everything Paystack and RevenueCat have sent us. Deliveries are recorded before they are acted on, so a purchase or a payout that did not land can be traced to the event that carried it."
      />
      <div className="flex flex-col gap-6">
        <DeliveriesPanel query={stats} />
        <WebhooksTable
          query={events}
          onOpen={payload.show}
          onPageChange={list.setPage}
          toolbar={
            <TableToolbar onReset={list.filtered ? list.reset : undefined}>
              <SearchField
                value={list.values.q}
                onChange={(q) => list.setFilter({ q })}
                placeholder="Search by name"
              />
              <OptionSelect
                label="Provider"
                allLabel="All providers"
                value={list.values.provider}
                onChange={(provider) => list.setFilter({ provider })}
                options={PROVIDER_OPTIONS}
              />
              <OptionSelect
                label="Outcome"
                allLabel="All outcomes"
                value={list.values.status}
                onChange={(status) => list.setFilter({ status })}
                options={STATUS_OPTIONS}
              />
            </TableToolbar>
          }
        />
      </div>
      <WebhookPayloadDialog
        query={payload.query}
        open={payload.open}
        onClose={payload.close}
      />
    </>
  )
}
