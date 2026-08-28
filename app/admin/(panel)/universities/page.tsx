"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { UniversitiesTable } from "@/features/admin/universities/universities-table"
import {
  useUniversities,
  useUniversityMutations,
} from "@/features/admin/universities/use-universities"
import type { ListUniversitiesParams } from "@/features/admin/universities/types"

export default function UniversitiesPage() {
  const [params, setParams] = useState<ListUniversitiesParams>({
    page: 1,
    perPage: 20,
  })
  const query = useUniversities(params)
  const mutations = useUniversityMutations()

  function patch(next: Partial<ListUniversitiesParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader
        title="Universities"
        description="Manage campuses and their paid-mode funds."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load universities.
        </p>
      ) : (
        <UniversitiesTable
          data={query.data}
          params={params}
          onParams={patch}
          mutations={mutations}
        />
      )}
    </>
  )
}
