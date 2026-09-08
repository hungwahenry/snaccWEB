"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { OpsView } from "@/features/admin/ops/components/ops-view"

export function OpsScreen() {
  return (
    <>
      <PageHeader
        title="Ops & maintenance"
        description="System health, background jobs, and whether the data still adds up."
      />
      <OpsView />
    </>
  )
}
