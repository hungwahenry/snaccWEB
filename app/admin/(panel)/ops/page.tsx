"use client"

import { PageHeader } from "@/components/page-header"
import { OpsView } from "@/features/admin/ops/components/ops-view"

export default function OpsPage() {
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
