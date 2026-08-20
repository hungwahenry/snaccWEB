"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { SuspensionReasonsTable } from "@/features/admin/suspension-reasons/reasons-table"
import {
  useSuspensionReasonMutations,
  useSuspensionReasons,
} from "@/features/admin/suspension-reasons/use-suspension-reasons"

export default function SuspensionReasonsPage() {
  const query = useSuspensionReasons()
  const mutations = useSuspensionReasonMutations()

  return (
    <>
      <PageHeader
        title="Suspension reasons"
        description="The wording a suspended user reads on the only screen they can still reach."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load reasons.</p>
      ) : (
        <SuspensionReasonsTable reasons={query.data} mutations={mutations} />
      )}
    </>
  )
}
