"use client"

import { PageHeader } from "@/components/page-header"
import { SuspensionsView } from "@/features/admin/users/components/suspensions-view"

export default function SuspensionsPage() {
  return (
    <>
      <PageHeader
        title="Suspensions"
        description="Who is currently suspended, why, and until when."
      />
      <SuspensionsView />
    </>
  )
}
