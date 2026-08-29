"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { PromptsTable } from "@/features/admin/onboarding-prompts/components/prompts-table"
import {
  usePromptMutations,
  usePrompts,
} from "@/features/admin/onboarding-prompts/hooks/use-onboarding-prompts"

export default function PromptsPage() {
  const query = usePrompts()
  const mutations = usePromptMutations()

  return (
    <>
      <PageHeader
        title="Onboarding prompts"
        description="Starter chips shown on the first-post screen."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load prompts.
        </p>
      ) : (
        <PromptsTable prompts={query.data} mutations={mutations} />
      )}
    </>
  )
}
