"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { ModerationView } from "@/features/admin/moderation/components/moderation-view"

export function ModerationScreen() {
  return (
    <>
      <PageHeader
        title="Automatic review"
        description="What the classifier looks at, what its scores mean, and what it has decided so far."
      />
      <ModerationView />
    </>
  )
}
