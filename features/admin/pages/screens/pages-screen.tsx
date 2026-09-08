"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { PagesTable } from "@/features/admin/pages/components/pages-table"
import {
  usePageMutations,
  usePages,
} from "@/features/admin/pages/hooks/use-pages"

export function PagesScreen() {
  const query = usePages()
  const mutations = usePageMutations()

  return (
    <>
      <PageHeader
        title="Pages"
        description="Custom pages like Terms and Privacy."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load pages.
        </p>
      ) : (
        <PagesTable pages={query.data} mutations={mutations} />
      )}
    </>
  )
}
