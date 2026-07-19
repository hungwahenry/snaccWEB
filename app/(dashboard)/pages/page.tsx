"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { PagesTable } from "@/features/pages/pages-table"
import { usePageMutations, usePages } from "@/features/pages/use-pages"

export default function PagesPage() {
  const query = usePages()
  const mutations = usePageMutations()

  return (
    <>
      <PageHeader title="Pages" description="Custom pages like Terms and Privacy." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load pages.</p>
      ) : (
        <PagesTable pages={query.data} mutations={mutations} />
      )}
    </>
  )
}
