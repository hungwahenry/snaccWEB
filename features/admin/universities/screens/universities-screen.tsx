"use client"

import { useUniversitiesScreen } from "@/features/admin/universities/hooks/use-universities-screen"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { UniversitiesTable } from "@/features/admin/universities/components/universities-table"
import { useUniversityMutations } from "@/features/admin/universities/hooks/use-universities"

export function UniversitiesScreen() {
  const { params, patch, query } = useUniversitiesScreen()
  const mutations = useUniversityMutations()

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
