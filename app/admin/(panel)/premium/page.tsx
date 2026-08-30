"use client"

import { PageHeader } from "@/components/page-header"
import { PremiumView } from "@/features/admin/premium/components/premium-view"

export default function PremiumPage() {
  return (
    <>
      <PageHeader
        title="Premium"
        description="Who subscribes, how they pay, and what the paywall says. Subscriptions are written by RevenueCat's webhook — nothing here charges anyone, and granting Premium by hand is recorded as promotional so it never counts as revenue."
      />
      <PremiumView />
    </>
  )
}
