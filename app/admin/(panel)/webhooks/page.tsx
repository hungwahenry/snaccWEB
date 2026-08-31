"use client"

import { PageHeader } from "@/components/page-header"
import { WebhooksView } from "@/features/admin/webhooks/components/webhooks-view"

export default function WebhooksPage() {
  return (
    <>
      <PageHeader
        title="Webhooks"
        description="Everything Paystack and RevenueCat have sent us. Deliveries are recorded before they are acted on, so a purchase or a payout that did not land can be traced to the event that carried it."
      />
      <WebhooksView />
    </>
  )
}
