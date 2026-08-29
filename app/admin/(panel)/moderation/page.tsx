"use client"

import { PageHeader } from "@/components/page-header"
import { ModerationView } from "@/features/admin/moderation/components/moderation-view"

export default function ModerationPage() {
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
