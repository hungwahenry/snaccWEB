"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SuspensionsView } from "@/features/admin/users/components/suspensions-view"

export function SuspensionsScreen() {
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
